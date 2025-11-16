import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../../components/common/LoadingSpinner/LoadingSpinner';

// Đặt URL backend của bạn ở đây
const API_BASE_URL = 'http://localhost:8888';

// --- CÁC COMPONENT TỰ CHỨA ĐỂ KHẮC PHỤC LỖI IMPORT ---
// (Copy từ các file khác của bạn để đảm bảo nhất quán)

// 1. Component StyleInjector để nhúng CSS
const StyleInjector = ({ styles }) => {
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, [styles]);
  return null;
};

// 2. Component LoadingSpinner


// 3. Component FontAwesomeIcon và Icon
const faCircleExclamation = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor">
    <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/>
  </svg>
);

const FontAwesomeIcon = ({ icon, style }) => {
  return (
    <span style={{ ...style, display: 'inline-block', width: '1em', height: '1em', verticalAlign: 'middle' }}>
      {icon}
    </span>
  );
};
// --- KẾT THÚC COMPONENT TỰ CHỨA ---


export default function VerifyPasswordOTP() {
  const [otpInputs, setOtpInputs] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]); 
  const [email, setEmail] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); 
  const [errorOtp, setErrorOtp] = useState(''); 
  
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const effectRan = useRef(false);


  useEffect(() => {
    if (effectRan.current === false) {
      if (location.state && location.state.email) {
        setEmail(location.state.email);
        toast.success(`Mã OTP đã được gửi đến ${location.state.email}.`);
      } else {
        toast.error("Vui lòng nhập email của bạn trước.");
        navigate('/forgot-password', { replace: true });
      }
    }
    return () => { effectRan.current = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  // 2. Xử lý đếm ngược (Giống hệt VerifyOTP)
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      setCanResend(false);
      interval = setInterval(() => setResendTimer(prev => prev - 1), 1000);
    } else {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // 3. Hiển thị lỗi chung bằng Toast
  useEffect(() => {
    if (error) {
      toast.error(error);
      setError(null);
    }
  }, [error]);

  // 4. Các hàm xử lý 6 ô input (Giống hệt VerifyOTP)
  const handleBlurOtp = () => {
    const otpString = otpInputs.join('');
    if (!otpString.trim()) setErrorOtp('Mã OTP không được để trống.');
    else if (!/^\d{6}$/.test(otpString)) setErrorOtp('Mã OTP phải là 6 chữ số.');
    else setErrorOtp('');
  };

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otpInputs];
    newOtp[index] = value.slice(-1);
    setOtpInputs(newOtp);
    if (value && index < 5) inputRefs.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otpInputs[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').trim();
    if (paste.length === 6 && /^\d{6}$/.test(paste)) {
      setOtpInputs(paste.split(''));
      inputRefs.current[5].focus();
      setErrorOtp('');
    }
  };

  // 5. Xử lý Gửi lại OTP
  const handleResendOTP = async () => {
    if (!canResend) return;
    setIsLoading(true);
    setError(null);
    setCanResend(false);

    try {
      // Gọi lại API 'forgot-password'
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Không thể gửi lại mã OTP.');
      }
      toast.success("Đã gửi lại mã OTP. Vui lòng kiểm tra email.");
      setResendTimer(60); 

    } catch (err) {
      setError(err.message);
      setCanResend(true); 
    } finally {
      setIsLoading(false);
    }
  };

  // 6. Xử lý Xác nhận OTP (KHÁC BIỆT CHÍNH)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otpInputs.join('');
    handleBlurOtp();
    if (errorOtp || !otpString || otpString.length < 6) return;

    setIsLoading(true);
    setError(null);

    try {
      // GỌI API MỚI: (Giả sử là /verify-forgot-otp)
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/verify-forgot-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email, // Gửi email thay vì username
          otp: otpString
        })
      });

      if (!response.ok) {
         const errorText = await response.text();
         throw new Error(errorText || 'Mã OTP không chính xác hoặc đã hết hạn.');
      }

      // Backend nên trả về 1 token tạm thời (reset token)
      const data = await response.json(); // Giả sử data = { "token": "..." }
      
      if (!data.token) {
        throw new Error("Lỗi máy chủ: Không nhận được token reset.");
      }

      toast.success("Xác thực thành công! Vui lòng đặt mật khẩu mới.");

      // CHUYỂN HƯỚNG ĐẾN TRANG 3: Reset Password
      // Truyền cả email và token reset
       navigate('/reset-password', { 
         replace: true, 
         state: { 
           token: data.token, 
           email: email 
         } 
       }); 

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false); 
    }
  };

  // Định nghĩa CSS (Giống hệt file VerifyOTP)
  const allStyles = `
    /* CSS Chung từ LoginPage.css */
    .auth-container { min-height: 100vh; display: flex; justify-content: center; align-items: center; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; box-sizing: border-box; }
    .back-home-btn { position: absolute; top: 20px; left: 20px; background: rgba(255, 255, 255, 0.8); border-radius: 50%; width: 40px; height: 40px; display: flex; justify-content: center; align-items: center; text-decoration: none; box-shadow: 0 2px 5px rgba(0,0,0,0.2); }
    .home-icon { width: 24px; height: 24px; }
    .auth-box { background: #ffffff; padding: 30px 40px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); width: 100%; max-width: 450px; text-align: center; box-sizing: border-box; }
    .auth-header { margin-bottom: 25px; }
    .auth-logo { width: 80px; margin-bottom: 15px; }
    .welcome-text { font-size: 24px; font-weight: 600; color: #333; margin-bottom: 10px; }
    .form-group { margin-bottom: 20px; text-align: left; }
    .form-group label { display: block; margin-bottom: 8px; font-weight: 600; color: #555; font-size: 14px; }
    .form-group input { width: 100%; padding: 12px 15px; border: 1px solid #ddd; border-radius: 8px; box-sizing: border-box; font-size: 16px; }
    .form-group input:focus { border-color: #007bff; box-shadow: 0 0 0 2px rgba(0,123,255,0.2); outline: none; }
    .submit-btn:disabled { background-color: #aaa; cursor: not-allowed; }
    .auth-redirect { margin-top: 25px; font-size: 14px; color: #555; }
    #alertPw { font-size: 13px; color: red; display: inline-block; margin-top: 5px; }
    .loading-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255, 255, 255, 0.7); display: flex; justify-content: center; align-items: center; z-index: 9999; }
    .loading-spinner { border: 5px solid #f3f3f3; border-top: 5px solid #007bff; border-radius: 50%; width: 50px; height: 50px; animation: spin 1s linear infinite; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    
    /* CSS MỚI CHO 6 Ô OTP */
    .otp-input-container { display: flex; justify-content: space-between; margin-top: 10px; }
    .otp-input { width: 15%; height: 55px; text-align: center; font-size: 22px; font-weight: 600; border: 1px solid #ddd; border-radius: 8px; box-sizing: border-box; -moz-appearance: textfield; }
    .otp-input::-webkit-outer-spin-button, .otp-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
    .otp-input:focus { border-color: #007bff; box-shadow: 0 0 0 2px rgba(0,123,255,0.2); outline: none; }

    /* CSS riêng từ VerifyOTP.css */
    .otp-instruct { font-size: 14px; color: #555; text-align: center; margin-top: -10px; margin-bottom: 20px; line-height: 1.5; }
    .otp-instruct strong { color: #0056b3; }
    .resend-group { display: flex; justify-content: center; align-items: center; margin-top: 10px; margin-bottom: 15px; }
    .resend-timer { font-size: 14px; color: #777; }
    .resend-btn { font-size: 14px; color: #007bff; background: none; border: none; padding: 0; cursor: pointer; text-decoration: underline; }
    .resend-btn:hover { color: #0056b3; }
    .resend-btn:disabled { color: #aaa; cursor: not-allowed; text-decoration: none; }
  `;

  return (
    <>
      <StyleInjector styles={allStyles} />
      <div className="auth-container"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/background.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}>
        
        <LoadingSpinner isLoading={isLoading} />
        
        <Link to="/" className="back-home-btn">
          <img src="/back.png" alt="Trang chủ" className="home-icon" />
        </Link>
        
        <div className="auth-box">
          <div className="auth-header">
            <img src="/logologin.png" alt="Logo" className="auth-logo" />
            <p className="welcome-text">Khôi phục mật khẩu</p>
            <p className="otp-instruct">
              Mã OTP đã được gửi đến <strong>{email}</strong>.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Mã OTP</label>
              <div className="otp-input-container" onPaste={handlePaste}>
                {otpInputs.map((data, index) => (
                  <input
                    key={index}
                    ref={el => (inputRefs.current[index] = el)}
                    type="text" 
                    className="otp-input"
                    maxLength={1}
                    inputMode="numeric"
                    pattern="[0-9]"
                    value={data}
                    onChange={e => handleChange(e, index)}
                    onKeyDown={e => handleKeyDown(e, index)}
                    style={errorOtp ? { borderColor: 'red' } : {}}
                    autoComplete="one-time-code"
                  />
                ))}
              </div>
              <span id="alertPw" style={{ display: errorOtp ? 'inline-block' : 'none' }}>
                <FontAwesomeIcon icon={faCircleExclamation} style={{ color: 'red', marginRight: '5px' }} />
                {errorOtp}
              </span>
            </div>
            
            <div className="form-group resend-group">
              {canResend ? (
                <button 
                  type="button" 
                  className="resend-btn" 
                  onClick={handleResendOTP}
                  disabled={isLoading}
                >
                  Gửi lại mã
                </button>
              ) : (
                <span className="resend-timer">
                  Gửi lại mã sau {resendTimer} giây
                </span>
              )}
            </div>

            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? 'Đang xác thực...' : 'Xác nhận'}
            </button>
          </form>

          <p className="auth-redirect">
            Quay lại trang? <Link to="/login">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </>
  );
}
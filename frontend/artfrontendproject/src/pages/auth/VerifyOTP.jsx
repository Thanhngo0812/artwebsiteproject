import React, { useState, useEffect, useRef } from 'react';
// Import các hook từ react-router-dom
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

// URL Backend (giống như trang Login)
const API_BASE_URL = 'http://localhost:8888';

// --- CÁC COMPONENT TỰ CHỨA ĐỂ KHẮC PHỤC LỖI IMPORT ---

// 1. Component StyleInjector để nhúng CSS
// Component này sẽ tự động thêm CSS vào <head> của trang
const StyleInjector = ({ styles }) => {
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
    
    // Cleanup function: Xóa style khi component bị unmount
    return () => {
      document.head.removeChild(styleElement);
    };
  }, [styles]); // Chỉ chạy lại nếu prop 'styles' thay đổi

  return null; // Component này không render gì cả
};

// 2. Component LoadingSpinner (thay thế import)
const LoadingSpinner = ({ isLoading }) => {
  if (!isLoading) return null;
  return (
    <div className="loading-overlay">
      <div className="loading-spinner"></div>
    </div>
  );
};

// 3. Component FontAwesomeIcon và Icon (thay thế import)
// Đây là SVG cho icon 'faCircleExclamation'
const faCircleExclamation = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor">
    <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/>
  </svg>
);

// Component FontAwesomeIcon đơn giản hóa để render SVG
const FontAwesomeIcon = ({ icon, style }) => {
  return (
    <span style={{ 
      ...style, 
      display: 'inline-block', 
      width: '1em', 
      height: '1em',
      verticalAlign: 'middle' // Căn chỉnh icon
    }}>
      {icon}
    </span>
  );
};

// --- KẾT THÚC COMPONENT TỰ CHỨA ---


export default function VerifyOTP() {
  // const [otp, setOtp] = useState(''); // Thay thế state này
  const [otpInputs, setOtpInputs] = useState(new Array(6).fill("")); // State mới cho 6 ô
  const inputRefs = useRef([]); // Ref để quản lý focus

  const [username, setUsername] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); // Lỗi chung từ API
  const [errorOtp, setErrorOtp] = useState(''); // Lỗi validation
  
  // State cho việc đếm ngược gửi lại OTP
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // 1. Lấy username từ state của react-router
  useEffect(() => {
    if (location.state && location.state.username) {
      setUsername(location.state.username);
      toast.success(`Mã OTP đã được gửi đến email liên kết với ${location.state.username}.`);
    } else {
      // Nếu không có username (người dùng tự ý vào trang này)
      // Điều hướng về trang đăng nhập
      toast.error("Vui lòng đăng nhập để tiếp tục.");
      navigate('/login');
    }
    // Chỉ chạy 1 lần khi component mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. Xử lý đếm ngược
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      setCanResend(false); // Không cho gửi lại khi đang đếm
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true); // Cho phép gửi lại
      clearInterval(interval);
    }
    // Cleanup function
    return () => clearInterval(interval);
  }, [resendTimer]);

  // 3. Hiển thị lỗi chung bằng Toast
  useEffect(() => {
    if (error) {
      toast.error(error);
      // Không cần setError(null) ở đây, sẽ reset trong handleSubmit
    }
  }, [error]);

  // 4. Xử lý validation khi người dùng blur khỏi input
  const handleBlurOtp = () => {
    const otpString = otpInputs.join(''); // Gộp 6 ô thành chuỗi
    if (!otpString.trim()) {
      setErrorOtp('Mã OTP không được để trống.');
    } else if (!/^\d{6}$/.test(otpString)) { // Kiểm tra chuỗi 6 số
      setErrorOtp('Mã OTP phải là 6 chữ số.');
    } else {
      setErrorOtp('');
    }
  };

  // --- HÀM MỚI ĐỂ XỬ LÝ 6 Ô INPUT ---
  const handleChange = (e, index) => {
    const value = e.target.value;
    // Chỉ chấp nhận số
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otpInputs];
    newOtp[index] = value.slice(-1); // Lấy ký tự cuối cùng (cho phép gõ đè)
    setOtpInputs(newOtp);

    // Tự động chuyển focus tới ô tiếp theo
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Xử lý Backspace
    if (e.key === 'Backspace') {
      // Nếu ô hiện tại trống và không phải ô đầu tiên, focus lùi
      if (!otpInputs[index] && index > 0) {
        inputRefs.current[index - 1].focus();
      }
      // Nếu ô hiện tại có chữ, onChange sẽ xử lý việc xóa và focus không đổi
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').trim();
    
    // Nếu paste là 6 chữ số
    if (paste.length === 6 && /^\d{6}$/.test(paste)) {
      const newOtp = paste.split('');
      setOtpInputs(newOtp);
      inputRefs.current[5].focus(); // Focus vào ô cuối cùng
      setErrorOtp(''); // Xóa lỗi nếu có
    }
  };
  // --- KẾT THÚC HÀM MỚI ---


  // 5. Xử lý Gửi lại OTP
  const handleResendOTP = async () => {
    if (!canResend) return;

    setIsLoading(true);
    setError(null);
    setCanResend(false);

    try {
      // Gọi API để gửi lại OTP
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username })
      });

      if (!response.ok) {
        // Lấy lỗi từ body nếu có
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Không thể gửi lại mã OTP. Vui lòng thử lại.');
      }

      toast.success("Đã gửi lại mã OTP. Vui lòng kiểm tra email.");
      setResendTimer(60); // Reset đồng hồ

    } catch (err) {
      setError(err.message || 'Lỗi kết nối khi gửi lại OTP.');
      setCanResend(true); // Cho phép thử lại nếu lỗi
    } finally {
      setIsLoading(false);
    }
  };

  // 6. Xử lý Xác nhận OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const otpString = otpInputs.join(''); // Gộp 6 ô thành chuỗi

    // Chạy validation lần cuối trước khi gửi
    handleBlurOtp();
    if (errorOtp) {
      return; // Dừng lại nếu có lỗi validation
    }
    // Kiểm tra lại nếu người dùng chưa blur
    if (!otpString.trim() || otpString.length < 6) {
      setErrorOtp('Mã OTP phải là 6 chữ số.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Gọi API xác thực OTP
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username,
          otp: otpString // Gửi chuỗi OTP đã gộp
        })
      });

      // Nếu response không OK, ném lỗi
      if (!response.ok) {
         // Lấy lỗi từ body (ví dụ: "Mã OTP sai" hoặc "Hết hạn")
         const errorData = await response.json().catch(() => ({}));
         throw new Error(errorData.message || 'Mã OTP không chính xác hoặc đã hết hạn.');
      }

      // XÁC THỰC THÀNH CÔNG
      // Backend nên trả về token và thông tin user ở đây
      const data = await response.json();

      // Giả sử backend trả về accessToken và refreshToken
      // Bạn sẽ cần lưu chúng vào localStorage hoặc context
      // Ví dụ: authService.handleLoginSuccess(data);
      localStorage.setItem('user', data.token);// Giả sử

      toast.success("Xác thực thành công! Đang đăng nhập...");

      // Điều hướng đến trang chính của ứng dụng
      // (Bạn có thể cần reload để các phần khác của app nhận token)
       navigate('/', { replace: true }); // Hoặc '/'
       window.location.reload(); // Để đảm bảo toàn bộ app được cập nhật trạng thái login

    } catch (err) {
      // Bắt lỗi (lỗi mạng hoặc lỗi từ backend)
      setError(err.message || 'Lỗi không xác định.');
    } finally {
      setIsLoading(false); // Dừng tải
    }
  };

  // Định nghĩa CSS dưới dạng một chuỗi
  // Bao gồm CSS của LoginPage và VerifyOTP
  const allStyles = `
    /* CSS Chung từ LoginPage.css */
    .auth-container {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      box-sizing: border-box; /* Thêm box-sizing */
    }
    .back-home-btn {
      position: absolute;
      top: 20px;
      left: 20px;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      text-decoration: none;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }
    .home-icon {
      width: 24px;
      height: 24px;
    }
    .auth-box {
      background: #ffffff;
      padding: 30px 40px; /* Giảm padding một chút */
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 450px;
      text-align: center;
      box-sizing: border-box;
    }
    .auth-header {
      margin-bottom: 25px;
    }
    .auth-logo {
      width: 80px;
      margin-bottom: 15px;
    }
    .welcome-text {
      font-size: 24px;
      font-weight: 600;
      color: #333;
      margin-bottom: 10px;
    }
    .form-group {
      margin-bottom: 20px;
      text-align: left;
    }
    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: #555;
      font-size: 14px;
    }
    .form-group input {
      width: 100%;
      padding: 12px 15px;
      border: 1px solid #ddd;
      border-radius: 8px;
      box-sizing: border-box; /* Quan trọng */
      font-size: 16px;
    }
    .form-group input:focus {
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0,123,255,0.2);
      outline: none;
    }
    // .submit-btn {
    //   width: 100%;
    //   padding: 14px;
    //   border: none;
    //   border-radius: 8px;
    //   background-color: #007bff;
    //   color: white;
    //   font-size: 16px;
    //   font-weight: 600;
    //   cursor: pointer;
    //   transition: background-color 0.3s;
    // }
    // .submit-btn:hover {
    //   background-color: #0056b3;
    // }
    // .submit-btn:disabled {
    //   background-color: #aaa;
    //   cursor: not-allowed;
    // }
    .auth-redirect {
      margin-top: 25px;
      font-size: 14px;
      color: #555;
    }
    .auth-redirect a {
        color: #222;
        text-decoration: none;
        font-weight: 500;
    }
    .auth-redirect a:hover {
      text-decoration: underline;
    }
    
    /* CSS cho thông báo lỗi inline */
    #alertPw {
      font-size: 13px;
      color: red;
      display: inline-block;
      margin-top: 5px;
    }

    /* CSS cho LoadingSpinner */
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }
    .loading-spinner {
      border: 5px solid #f3f3f3;
      border-top: 5px solid #007bff;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    /* CSS MỚI CHO 6 Ô OTP */
    .otp-input-container {
      display: flex;
      justify-content: space-between;
      margin-top: 10px; /* Thêm khoảng cách với label */
    }
    .otp-input {
      width: 15%; /* Chia 6 ô, có khoảng trống nhỏ */
      height: 55px; /* Tăng chiều cao */
      text-align: center;
      font-size: 22px; /* Tăng cỡ chữ */
      font-weight: 600;
      border: 1px solid #ddd;
      border-radius: 8px;
      box-sizing: border-box; /* Rất quan trọng */
      
      /* Xóa mũi tên tăng/giảm của input type=number */
      -moz-appearance: textfield;
    }
    .otp-input::-webkit-outer-spin-button,
    .otp-input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    .otp-input:focus {
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0,123,255,0.2);
      outline: none;
    }
    /* KẾT THÚC CSS MỚI */

    /* CSS riêng từ VerifyOTP.css */
    .otp-instruct {
      font-size: 14px;
      color: #555;
      text-align: center;
      margin-top: -10px;
      margin-bottom: 20px;
      line-height: 1.5;
    }
    .otp-instruct strong {
      color: #0056b3; /* Màu nhấn mạnh cho username */
    }
    .resend-group {
      display: flex;
      justify-content: center; /* Căn giữa nội dung */
      align-items: center;
      margin-top: 10px;
      margin-bottom: 15px;
    }
    .resend-timer {
      font-size: 14px;
      color: #777;
    }
    .resend-btn {
      font-size: 14px;
      color: #007bff;
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      text-decoration: underline;
    }
    .resend-btn:hover {
      color: #0056b3;
    }
    .resend-btn:disabled {
      color: #aaa;
      cursor: not-allowed;
      text-decoration: none;
    }
  `;

  return (
    <>
      {/* 1. Nhúng CSS vào trang */}
      <StyleInjector styles={allStyles} />
      
      {/* 2. Render nội dung */}
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
            <p className="welcome-text">Xác thực tài khoản</p>
            <p className="otp-instruct">
              Một mã OTP gồm 6 chữ số đã được gửi đến email liên kết với tài khoản <strong>{username}</strong>.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Mã OTP</label>
              
              {/* Vùng nhập 6 ô OTP */}
              <div className="otp-input-container" onPaste={handlePaste}>
                {otpInputs.map((data, index) => (
                  <input
                    key={index}
                    ref={el => (inputRefs.current[index] = el)}
                    type="text" // Dùng "text" để xử lý Backspace/Paste dễ hơn
                    className="otp-input"
                    maxLength={1}
                    inputMode="numeric" // Bàn phím số trên di động
                    pattern="[0-9]"
                    value={data}
                    onChange={e => handleChange(e, index)}
                    onKeyDown={e => handleKeyDown(e, index)}
                    style={errorOtp ? { borderColor: 'red' } : {}}
                    autoComplete="one-time-code"
                  />
                ))}
              </div>

              {/* Hiển thị lỗi validation */}
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

            <button typeT="submit" className="submit-btn" disabled={isLoading}>
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
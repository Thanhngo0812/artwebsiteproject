import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../../components/common/LoadingSpinner/LoadingSpinner';
import { jwtDecode } from 'jwt-decode';

const API_BASE_URL = 'http://localhost:8888';

// --- CÁC COMPONENT TỰ CHỨA ---
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

const faCircleExclamation = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor">
    <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z" />
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

export default function VerifyOTP() {
  const [otpInputs, setOtpInputs] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorOtp, setErrorOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.username) {
      setUsername(location.state.username);
      toast.success(location.state.message);
    } else {
      toast.error("Vui lòng đăng nhập để tiếp tục.");
      navigate('/login');
    }
  }, []);

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      setCanResend(false);
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleBlurOtp = () => {
    const otpString = otpInputs.join('');
    if (!otpString.trim()) {
      setErrorOtp('Mã OTP không được để trống.');
    } else if (!/^\d{6}$/.test(otpString)) {
      setErrorOtp('Mã OTP phải là 6 chữ số.');
    } else {
      setErrorOtp('');
    }
  };

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otpInputs];
    newOtp[index] = value.slice(-1);
    setOtpInputs(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!otpInputs[index] && index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').trim();
    if (paste.length === 6 && /^\d{6}$/.test(paste)) {
      const newOtp = paste.split('');
      setOtpInputs(newOtp);
      inputRefs.current[5].focus();
      setErrorOtp('');
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;
    setIsLoading(true);
    setError(null);
    setCanResend(false);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Không thể gửi lại mã OTP. Vui lòng thử lại.');
      }

      toast.success("Đã gửi lại mã OTP. Vui lòng kiểm tra email.");
      setResendTimer(60);
    } catch (err) {
      setError(err.message || 'Lỗi kết nối khi gửi lại OTP.');
      setCanResend(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otpInputs.join('');
    handleBlurOtp();
    if (errorOtp) return;
    if (!otpString.trim() || otpString.length < 6) {
      setErrorOtp('Mã OTP phải là 6 chữ số.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username,
          otp: otpString
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Mã OTP không chính xác hoặc đã hết hạn.');
      }

      // XÁC THỰC THÀNH CÔNG
      const data = await response.json();
      localStorage.setItem('user', data.token);
      localStorage.setItem('username', username);
      toast.success("Xác thực thành công! Đang đăng nhập...");

      // Phân quyền và điều hướng
      try {
        const decodedToken = jwtDecode(data.token);
        const roles = decodedToken.roles || [];

        if (roles.includes('ROLE_ADMIN')) {
          window.location.href = '/admin';
        } else {
          window.location.href = '/';
        }
      } catch (e) {
        console.error("Lỗi decode token:", e);
        window.location.href = '/';
      }

    } catch (err) {
      setError(err.message || 'Lỗi không xác định.');
    } finally {
      setIsLoading(false);
    }
  };

  const allStyles = `
    .auth-container {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      box-sizing: border-box;
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
      padding: 30px 40px;
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
      box-sizing: border-box;
      font-size: 16px;
    }
    .form-group input:focus {
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0,123,255,0.2);
      outline: none;
    }
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
    #alertPw {
      font-size: 13px;
      color: red;
      display: inline-block;
      margin-top: 5px;
    }
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
    .otp-input-container {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
    }
    .otp-input {
      width: 15%;
      height: 55px;
      text-align: center;
      font-size: 22px;
      font-weight: 600;
      border: 1px solid #ddd;
      border-radius: 8px;
      box-sizing: border-box;
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
    .otp-instruct {
      font-size: 14px;
      color: #555;
      text-align: center;
      margin-top: -10px;
      margin-bottom: 20px;
      line-height: 1.5;
    }
    .otp-instruct strong {
      color: #0056b3;
    }
    .resend-group {
      display: flex;
      justify-content: center;
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
            <p className="welcome-text">Xác thực tài khoản</p>
            <p className="otp-instruct">
              Một mã OTP gồm 6 chữ số đã được gửi đến email liên kết với tài khoản <strong>{username}</strong>.
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
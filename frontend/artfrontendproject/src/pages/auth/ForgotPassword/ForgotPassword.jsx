import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../../components/common/LoadingSpinner/LoadingSpinner';

// Đặt URL backend của bạn ở đây
const API_BASE_URL = 'http://localhost:8888';

// --- CÁC COMPONENT TỰ CHỨA ĐỂ KHẮC PHỤC LỖI IMPORT ---
// (Copy từ file RegisterPage.jsx để đảm bảo nhất quán)

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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [apiError, setApiError] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false); // State để ẩn form sau khi gửi

  const navigate = useNavigate();

  // Hiển thị lỗi API (lỗi 400) bằng toast
  useEffect(() => {
    if (apiError) {
      toast.error(apiError);
      setApiError(null); // Xóa lỗi sau khi hiển thị
    }
  }, [apiError]);

  // Xử lý validation khi blur
  const handleBlurEmail = () => {
    if (!email.trim()) {
      setValidationError('Email không được để trống.');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setValidationError('Email không hợp lệ.');
    } else {
      setValidationError('');
    }
  };

  // Xử lý khi gõ
  const handleChange = (e) => {
    setEmail(e.target.value);
    if (validationError) setValidationError('');
    if (apiError) setApiError(null);
  };

  // Xử lý Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    handleBlurEmail(); // Chạy validation lần cuối

    if (validationError || !email.trim()) {
      return;
    }

    setIsLoading(true);
    setApiError(null);

    try {
      // API backend của bạn cho chức năng này (ví dụ)
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Không thể xử lý yêu cầu. Email có thể không tồn tại.');
      }

      // const data = await response.json(); // Có thể backend trả về message
      
      // Thành công!
      navigate('/verify-password-otp', {
        replace: true,
        state: { email: email } // Truyền email qua cho trang sau
      });

    } catch (err) {
      setApiError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Định nghĩa CSS (Sao chép từ RegisterPage để đảm bảo nhất quán)
  const allStyles = `
    /* CSS Chung từ LoginPage.css */
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
    /* Thêm style cho mô tả */
    .auth-description {
      font-size: 15px;
      color: #555;
      margin-bottom: 25px;
      line-height: 1.5;
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
 
    .submit-btn:disabled {
      background-color: #aaa;
      cursor: not-allowed;
    }
    .auth-redirect {
      margin-top: 25px;
      font-size: 14px;
      color: #555;
    }

    
    /* CSS cho thông báo lỗi inline (validation) */
    .validation-error {
      font-size: 13px;
      color: red;
      display: inline;
      margin-top: 5px;
    }
    
    /* CSS cho input bị lỗi */
    .input-error {
      border-color: red !important;
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
            <p className="welcome-text">Quên mật khẩu?</p>
            
            {/* Nếu chưa gửi, hiển thị mô tả. Nếu đã gửi, hiển thị thông báo thành công */}
            {!isSubmitted ? (
              <p className="auth-description">
                Đừng lo lắng! Nhập email của bạn dưới đây và chúng tôi sẽ gửi
                cho bạn một liên kết để khôi phục mật khẩu.
              </p>
            ) : (
              <p className="auth-description" style={{ color: '#28a745', fontWeight: 'bold' }}>
                Yêu cầu đã được gửi! Vui lòng kiểm tra email (bao gồm cả thư mục spam)
                để nhận liên kết khôi phục.
              </p>
            )}
          </div>

          {/* Chỉ hiển thị form nếu chưa gửi */}
          {!isSubmitted && (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Email đã đăng ký"
                  name="email"
                  value={email}
                  onBlur={handleBlurEmail}
                  onChange={handleChange}
                  className={validationError ? 'input-error' : ''}
                  required
                />
                {validationError && (
                  <span className="validation-error">
                    <FontAwesomeIcon icon={faCircleExclamation} style={{ color: 'red', marginRight: '5px',marginBottom:'5px' }} />
                    {validationError}
                  </span>
                )}
              </div>
              
              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? 'Đang xử lý...' : 'Gửi liên kết khôi phục'}
              </button>
            </form>
          )}

          <p className="auth-redirect">
            Đã nhớ ra? <Link to="/login">Quay lại Đăng nhập</Link>
          </p>
        </div>
      </div>
    </>
  );
}
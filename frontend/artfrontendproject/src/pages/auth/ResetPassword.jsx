import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';

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


export default function ResetPasswordPage() {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // States cho loading và errors
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);

  // States để lưu thông tin từ trang trước
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // 1. Lấy token và email từ state của trang trước
  useEffect(() => {
    if (location.state && location.state.token && location.state.email) {
      setToken(location.state.token);
      setEmail(location.state.email);
    } else {
      toast.error("Phiên khôi phục mật khẩu không hợp lệ. Vui lòng thử lại.");
      navigate('/forgot-password', { replace: true });
    }
  }, [location, navigate]);

  // 2. Hiển thị lỗi API (lỗi 400) bằng toast
  useEffect(() => {
    if (apiError) {
      toast.error(apiError);
      setApiError(null);
    }
  }, [apiError]);

  // 3. Hàm validate (Giống RegisterPage)
  const validateField = (name, value) => {
    let errorMsg = '';
    switch (name) {
      case 'password':
        if (!value.trim()) errorMsg = 'Mật khẩu không được để trống.';
        else if (value.length < 8) errorMsg = 'Mật khẩu phải có ít nhất 8 ký tự.';
        break;
      case 'confirmPassword':
        if (!value.trim()) errorMsg = 'Vui lòng xác nhận mật khẩu.';
        else if (value !== formData.password) errorMsg = 'Mật khẩu xác nhận không khớp.';
        break;
      default:
        break;
    }
    return errorMsg;
  };

  // 4. Xử lý khi blur
  const handleBlur = (e) => {
    const { name, value } = e.target;
    const errorMsg = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: errorMsg }));
  };

  // 5. Xử lý khi thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (apiError) setApiError(null);
  };

  // 6. Xử lý Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate lần cuối
    const finalErrors = {};
    Object.keys(formData).forEach(key => {
      const errorMsg = validateField(key, formData[key]);
      if (errorMsg) finalErrors[key] = errorMsg;
    });

    if (Object.keys(finalErrors).length > 0) {
      setErrors(finalErrors);
      setIsLoading(false);
      return;
    }

    // Nếu không có lỗi, gọi API
    try {
      // GỌI API MỚI: /reset-password
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,       // Email từ trang trước
          token: token,       // Token reset từ trang trước
          newPassword: formData.password // Mật khẩu mới
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Không thể đổi mật khẩu. Token có thể đã hết hạn.');
      }
      
      // Đổi mật khẩu thành công!
      toast.success("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");

      // Chuyển hướng về trang Đăng nhập
      navigate('/login', { replace: true });

    } catch (err) {
      setApiError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Định nghĩa CSS (Sao chép từ RegisterPage để đảm bảo nhất quán)
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
    
    /* CSS cho thông báo lỗi inline (validation) */
    .validation-error { font-size: 13px; color: red; display: inline-block; margin-top: 5px; }
    .input-error { border-color: red !important; }
    .password-input { position: relative; }
    .toggle-password { position: absolute; top: 50%; right: 15px; transform: translateY(-50%); cursor: pointer; width: 20px; opacity: 0.6; }

    /* CSS cho LoadingSpinner */
    .loading-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255, 255, 255, 0.7); display: flex; justify-content: center; align-items: center; z-index: 9999; }
    .loading-spinner { border: 5px solid #f3f3f3; border-top: 5px solid #007bff; border-radius: 50%; width: 50px; height: 50px; animation: spin 1s linear infinite; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
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
            <p className="welcome-text">Đặt lại mật khẩu</p>
          </div>

          <form onSubmit={handleSubmit}>
            
            <div className="form-group">
              <label>Mật khẩu mới</label>
              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mật khẩu mới (ít nhất 8 ký tự)"
                  name="password"
                  value={formData.password}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  className={errors.password ? 'input-error' : ''}
                  required
                />
                <img
                  src={showPassword ? "/showpassword.png" : "/hidepassword.png"}
                  alt="toggle password"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                />
              </div>
              {errors.password && (
                <span className="validation-error">
                  <FontAwesomeIcon icon={faCircleExclamation} style={{ color: 'red', marginRight: '5px',marginBottom:'5px' }} />
                  {errors.password}
                </span>
              )}
            </div>
            
            <div className="form-group">
              <label>Xác nhận Mật khẩu mới</label>
              <div className="password-input">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Xác nhận Mật khẩu mới"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  className={errors.confirmPassword ? 'input-error' : ''}
                  required
                />
                <img
                  src={showConfirmPassword ? "/showpassword.png" : "/hidepassword.png"}
                  alt="toggle password"
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              </div>
              {errors.confirmPassword && (
                <span className="validation-error">
                  <FontAwesomeIcon icon={faCircleExclamation} style={{ color: 'red', marginRight: '5px' ,marginBottom:'5px'}} />
                  {errors.confirmPassword}
                </span>
              )}
            </div>
            
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? 'Đang lưu...' : 'Lưu mật khẩu mới'}
            </button>
          </form>

          <p className="auth-redirect">
            Đã nhớ ra? <Link to="/login">Quay lại Đăng nhập</Link>
          </p>
        </div>
      </div>
    </>
  );
}
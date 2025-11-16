import React, { useState, useEffect } from 'react';
// Link và useNavigate để điều hướng
import { useLocation, Link, useNavigate } from 'react-router-dom'; 

import './LoginPage.css';
import LoadingSpinner from '../../../components/common/LoadingSpinner/LoadingSpinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from 'react-toastify';
import { faExclamation,faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import authService from '../../../services/authService';

// Đặt URL backend của bạn ở đây
// (Tôi dùng 8888 vì thấy log của bạn ở port này)
const API_BASE_URL = 'http://localhost:8888';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  
  // Thêm state để xử lý lỗi và trạng thái tải
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorPass, setErrorPass] = useState('');
  const [errorUsername, setErrorUsername] = useState('');

  // Khởi tạo hook điều hướng
  const navigate = useNavigate();
  let location = useLocation();

  useEffect(() => {
    if (location.state && location.state.message) {
      toast.error(location.state.message);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  useEffect(() => {
    if (error) {
        // Sử dụng error.message để gọi toast
        toast.error(error); 
    }
    // Dependency Array: Sẽ chạy lại mỗi khi đối tượng 'error' thay đổi
    // (Chúng ta sẽ đảm bảo nó luôn thay đổi ở handleSubmit/validate)
}, [error]); 
  const handleSubmit = async (e) => {
    // authService.logout();
    e.preventDefault();
    setIsLoading(true); // Bắt đầu tải
    setError(null);     // Xóa lỗi cũ
    if (!formData.emailOrUsername || !formData.password) {
      setError('Tên đăng nhập hoặc mật khẩu không được để trống.');
      setErrorUsername('Tên đăng nhập không được để trống.')
      setErrorPass('Mật khẩu không được để trống.')
      setIsLoading(false);
      return;
    }
    else if(errorUsername||errorPass){
      setIsLoading(false);
      return;
    }else{
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Backend DTO (LoginRequest) mong đợi một trường "username"
        // Chúng ta ánh xạ "emailOrUsername" của frontend vào "username" của backend
        body: JSON.stringify({
          username: formData.emailOrUsername,
          password: formData.password
        })
      });

      
      if (!response.ok) {
        const errorText = await response.text(); 
        
        // 2. Dùng text đó để set lỗi (toast sẽ tự động hiển thị)
        // 'errorText' BÂY GIỜ CHÍNH LÀ: "Tài khoản của bạn đã bị khóa..."
        setError(errorText); 
        return;
      }
      const data = await response.json();
      // ĐĂNG NHẬP THÀNH CÔNG (Backend đã gửi OTP)
      navigate('/verify-otp', { 
        state: { username: formData.emailOrUsername ,
        message:data.message} 
      });

    } catch (err) {
      // Bắt lỗi (lỗi mạng hoặc lỗi từ backend)
       setError('Lỗi đăng nhập không xác định');
    } finally {
      setIsLoading(false); // Dừng tải
    }}
  };
  const handleBlurUsername = async (e) => {
    if(!formData.emailOrUsername.trim()){
      setErrorUsername('Tên đăng nhập không được để trống.')
    }
    else{
      setErrorUsername('')
    }
  }
  const handleBlurPassWord = async (e) => {
    if(!formData.password.trim()){
      setErrorPass('Mật khẩu không được để trống.')
    }
    else if(formData.password.length<8){
      setErrorPass('Mật khẩu phải ít nhất 8 kí tự.')
    }
    else{
      setErrorPass('')
    }
  }
  return (
    
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
          {/* <h2>Chào mừng bạn trở lại</h2> */}
          <p className="welcome-text">Chào mừng bạn trở lại!</p>
        </div>

      

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tên đăng nhập hoặc Email</label>
            <input
              type="text"
              placeholder="Tên đăng nhập hoặc Email"
              value={formData.emailOrUsername}
              onBlur={handleBlurUsername}
              style={errorUsername ? {borderColor: 'red'} : {}}
              onChange={(e) => setFormData({ ...formData, emailOrUsername: e.target.value })}
              required
            />
                 <span id="alertPw" style={{ display: errorUsername ? 'inline' : 'none' }}> 
    <FontAwesomeIcon icon={faCircleExclamation} style={{ color: 'red', marginRight: '5px' }} /> 
    {/* Chỉ cần render trực tiếp errorEmail */}
    {errorUsername} 
</span>
          </div>
          <div className="form-group">
            <label>Mật khẩu</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onBlur={handleBlurPassWord}
                style={errorPass ? {borderColor: 'red'} : {}}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              
              <img
                src={showPassword ? "/showpassword.png" : "/hidepassword.png"}
                alt="toggle password"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
            <span id="alertPw" style={{ display: errorPass ? 'inline' : 'none' }}> 
    <FontAwesomeIcon icon={faCircleExclamation} style={{ color: 'red', marginRight: '5px' }} /> 
    {/* Chỉ cần render trực tiếp errorEmail */}
    {errorPass} 
</span>
          </div>
          <div className="forgot-password">
            <Link to="/forgot-password">Quên mật khẩu?</Link>
          </div>
          
          {/* Vô hiệu hóa nút khi đang tải */}
          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
        </form>
        <p className="auth-redirect">
          Chưa có tài khoản? <Link to="/register">Đăng kí ngay</Link>
        </p>
      </div>
    </div>
  );
}

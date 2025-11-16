import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom'; 
import '../Login/LoginPage.css';
import LoadingSpinner from '../../../components/common/LoadingSpinner/LoadingSpinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from 'react-toastify';
import { faExclamation,faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
const API_BASE_URL = 'http://localhost:8888';
export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorPass, setErrorPass] = useState('');
  const [errorCPass, setErrorCPass] = useState('');

  const [errorUsername, setErrorUsername] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
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
  if (!formData.username || !formData.password|| !formData.confirmPassword|| !formData.email) {
    setError('Thông tin không được để trống.');
    setIsLoading(false);
    return;
  }
  else if(errorUsername||errorPass||errorCPass||errorEmail){
    setIsLoading(false);
    return;
  }else{
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Backend DTO (LoginRequest) mong đợi một trường "username"
      // Chúng ta ánh xạ "emailOrUsername" của frontend vào "username" của backend
      body: JSON.stringify({
        username: formData.username,
        email: formData.email,
        password: formData.password
      })
    });

   

    if (!response.ok) {
      const errormess = await response.text()
      // 2. Dùng text đó để set lỗi (toast sẽ tự động hiển thị)
      // 'errorText' BÂY GIỜ CHÍNH LÀ: "Tài khoản của bạn đã bị khóa..."
      setError(errormess); 
      return
    }
    const data = await response.json();
    // ĐĂNG NHẬP THÀNH CÔNG (Backend đã gửi OTP)
    navigate('/verify-otp', { 
      state: { username: formData.username ,
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
    if(!formData.username.trim()){
      setErrorUsername('Tên đăng nhập không được để trống.')
    }
    else if(formData.username.length<8){
      setErrorUsername('Tên đăng nhập tối thiểu 8 kí tự.')

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

  const handleBlurCPassWord = async (e) => {
    // 1. Kiểm tra xem ô 'Xác nhận Mật khẩu' có bị bỏ trống không
    // (Tôi sửa từ 'formData.password' thành 'formData.confirmPassword')
    if (!formData.confirmPassword.trim()) {
      setErrorCPass('Vui lòng xác nhận mật khẩu.');
    } 
    // 2. BỔ SUNG: Kiểm tra xem nó có khớp với mật khẩu chính không
    else if (formData.confirmPassword !== formData.password) {
      setErrorCPass('Mật khẩu xác nhận không khớp.');
    } 
    else {
      setErrorCPass('');
    }
  }
  /**
 * Xử lý validation khi người dùng rời khỏi ô "Email"
 * (Giả sử bạn dùng state `setErrorEmail` để set lỗi)
 */
const handleBlurEmail = (e) => {
  // 1. Lấy giá trị email và làm sạch (bỏ dấu cách)
  const emailValue = formData.email.trim();
  
  // 2. Kiểm tra xem có bị bỏ trống không
  if (!emailValue) {
    setErrorEmail('Email không được để trống.');
  } 
  
  // 3. Kiểm tra định dạng email (dùng regex)
  // (!/\S+@\S+\.\S+/.test(emailValue))
  else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailValue)) {
    setErrorEmail('Email không hợp lệ.');
  } 
  
  // 4. Nếu mọi thứ đều ổn
  else {
    setErrorEmail('');
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

          <p className="welcome-text">Chào đón thành viên mới</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tên đăng nhập (Tối thiểu 8 kí tự)</label>
            <input
              type="text"
              placeholder="Tên đăng nhập"
              value={formData.username}
              onBlur={handleBlurUsername}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required
            />
            <span id="alertPw" style={{ display: errorUsername ? 'inline' : 'none' }}> 
    <FontAwesomeIcon icon={faCircleExclamation} style={{ color: 'red', marginRight: '5px' }} /> 
    {/* Chỉ cần render trực tiếp errorEmail */}
    {errorUsername} 
</span>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              onBlur={handleBlurEmail}

              required
            />
            <span id="alertPw" style={{ display: errorEmail ? 'inline' : 'none' }}> 
    <FontAwesomeIcon icon={faCircleExclamation} style={{ color: 'red', marginRight: '5px' }} /> 
    {/* Chỉ cần render trực tiếp errorEmail */}
    {errorEmail} 
</span>
          </div>
          <div className="form-group">
            <label>Mật khẩu (Tối thiểu 8 kí tự)</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mật khẩu"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                onBlur={handleBlurPassWord}
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
          <div className="form-group">
            <label>Xác nhận mật khẩu</label>
            <div className="password-input">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Xác nhận mật khẩu"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                onBlur={handleBlurCPassWord}
                required
              />
              <img
                src={showConfirmPassword ? "/showpassword.png" : "/hidepassword.png"}
                alt="toggle password"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              />
             
            </div>
            <span id="alertPw" style={{ display: errorCPass ? 'inline' : 'none' }}> 
    <FontAwesomeIcon icon={faCircleExclamation} style={{ color: 'red', marginRight: '5px' }} /> 
    {/* Chỉ cần render trực tiếp errorEmail */}
    {errorCPass} 
</span>
          </div>
          <button type="submit" className="submit-btn">Đăng kí</button>
        </form>
        <p className="auth-redirect">
          Bạn chưa có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}
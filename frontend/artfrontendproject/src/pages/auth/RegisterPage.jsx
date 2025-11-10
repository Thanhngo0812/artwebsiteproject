import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './css/LoginPage.css';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from 'react-toastify';
import { faExclamation,faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
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
  const [errorUsername, setErrorUsername] = useState('');
  const [errorEmail, setErrorEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
  };

  return (
    <div className="auth-container"
    style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/background.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
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
              placeholder="Username"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Mật khẩu</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
              <img
                src={showPassword ? "/showpassword.png" : "/hidepassword.png"}
                alt="toggle password"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Xác nhận mật khẩu</label>
            <div className="password-input">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                required
              />
              <img
                src={showConfirmPassword ? "/showpassword.png" : "/hidepassword.png"}
                alt="toggle password"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            </div>
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
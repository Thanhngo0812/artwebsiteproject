import React, { useState } from 'react';
import './css/LoginPage.css';
import { Link } from 'react-router-dom';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="login-container"
    style={{
      backgroundImage: `url('/background.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      <Link to="/" className="back-home-btn">
        <img src="/back.png" alt="Trang chủ" className="home-icon" />
      </Link>
      <div className="login-box">
        <div className="login-header">
          <h2>{isLogin ? 'Login' : 'Register'}</h2>
          <p className="welcome-text">
            {isLogin 
              ? 'Welcome Back!' 
              : 'Join us today!'}
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Your Email</label>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Your Password</label>
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
          {!isLogin && (
            <div className="form-group">
              <label>Your Password Confirmation</label>
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
          )}
          {isLogin && (
            <div className="forgot-password">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>
          )}
          <button type="submit" className="submit-btn">
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        <p className="toggle-form">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={toggleForm}>
            {isLogin ? 'Register Now' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
}
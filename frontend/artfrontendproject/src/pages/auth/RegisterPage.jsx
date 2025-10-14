import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './css/LoginPage.css';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
  };

  return (
    <div className="auth-container"
    style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/background.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
      <Link to="/" className="back-home-btn">
        <img src="/back.png" alt="Trang chủ" className="home-icon" />
      </Link>
      <div className="auth-box">
        <div className="auth-header">
          <h2>Register</h2>
          <p className="welcome-text">Join us today!</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
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
            <label>Password</label>
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
            <label>Confirm Password</label>
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
          <button type="submit" className="submit-btn">Register</button>
        </form>
        <p className="auth-redirect">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
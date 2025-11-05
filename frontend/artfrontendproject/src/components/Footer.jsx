import React from "react";
import { Link } from "react-router-dom";
import "./css/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column">
          <h3 className="footer-title">Về Tranh Xịn</h3>
          <ul className="footer-links">
            <li><Link to="/about">Giới thiệu</Link></li>
            <li><Link to="/contact">Liên hệ</Link></li>
            <li><Link to="/stores">Hệ thống cửa hàng</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3 className="footer-title">Chính sách</h3>
          <ul className="footer-links">
            <li><Link to="/shipping">Chính sách giao hàng</Link></li>
            <li><Link to="/return">Chính sách đổi trả</Link></li>
            <li><Link to="/privacy">Chính sách bảo mật</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3 className="footer-title">Hỗ trợ khách hàng</h3>
          <ul className="footer-links">
            <li><Link to="/guide">Hướng dẫn mua hàng</Link></li>
            <li><Link to="/payment">Phương thức thanh toán</Link></li>
            <li><Link to="/faq">Câu hỏi thường gặp</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3 className="footer-title">Kết nối với chúng tôi</h3>
          <div className="footer-social">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">YouTube</a>
          </div>
          <div className="footer-contact">
            <p>📞 Hotline: 1900 xxxx</p>
            <p>✉️ Email: support@tranhxin.com</p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 Tranh Xịn. All rights reserved.</p>
      </div>
    </footer>
  );
}
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthService from '../../services/authService';


/**
 * Component bọc bảo vệ route.
 * @param {string} requiredRole - Role bắt buộc để truy cập. Ví dụ: "ADMIN", "USER"
 * @param {React.ReactNode} element - Component trang cần hiển thị.
 */
const ProtectedRoute = ({ requiredRole }) => {
  // const isAuthenticated = AuthService.isLoggedIn();
  const userRole = AuthService.getUserRole();
  const token = AuthService.getCurrentUser();

  // 1. Kiểm tra đăng nhập
  if (!token) {
    return <Navigate to="/login" replace state={{ message: 'Bạn chưa đăng nhập' }} />;
  }

  if (AuthService.isTokenExpired()) {
    return <Navigate to="/login" replace state={{ message: 'Phiên đăng nhập của bạn đã hết hạn.' }} />;
  }

  // 2. Kiểm tra Quyền (Role)
  if (requiredRole && !userRole.includes(requiredRole)) {
    // Nếu không có quyền cần thiết, chuyển hướng đến trang từ chối truy cập (hoặc trang chủ)
    console.warn(`Access denied. Required role: ${requiredRole}, User role: ${userRole}`);
    return <Navigate to="/" replace state={{ message: 'Bạn không có đủ quyền truy cập.' }} />;
  }

  // Nếu đã đăng nhập VÀ có quyền, hiển thị nội dung trang (Outlet là component con)
  return <Outlet />;
};

export default ProtectedRoute;
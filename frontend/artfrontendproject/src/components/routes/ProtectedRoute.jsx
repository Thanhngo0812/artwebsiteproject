import React from 'react';
import { Navigate,useNavigate, Outlet } from 'react-router-dom';
import AuthService from '../../services/authService';


/**
 * Component bọc bảo vệ route.
 * @param {string} requiredRole - Role bắt buộc để truy cập. Ví dụ: "ADMIN", "USER"
 * @param {React.ReactNode} element - Component trang cần hiển thị.
 */
const ProtectedRoute = ({ requiredRole }) => {
    const navigate = useNavigate();
    const isAuthenticated = AuthService.isLoggedIn();
    const userRole = AuthService.getUserRole();

    if (!isAuthenticated) {
        // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
        navigate('/', { 
            replace: true, // Tùy chọn: thay thế trang hiện tại trong lịch sử duyệt web
            state: { 
              message: 'Bạn chưa đăng nhập'
            } 
          });
    }
      // Đặt logic điều hướng vào trong useEffect
 
    // Chỉ thực hiện khi đã kiểm tra xong (isLoading = false)
    // và người dùng chưa đăng nhập
    if(AuthService.isTokenExpired()){
      return <Navigate to="/" replace state={{ message: 'Phiên đăng nhập của bạn đã hết hạn.' }} />;
  }
    if ( !isAuthenticated) {
        return <Navigate to="/" replace state={{ message: 'Bạn không có đủ quyền truy cập.' }} />;
      };
    
 
    
    // 2. Kiểm tra Quyền (Role)
    if (requiredRole && !userRole.includes(requiredRole)) {
        // Nếu không có quyền cần thiết, chuyển hướng đến trang từ chối truy cập (hoặc trang chủ)
        // Đây là lỗi 403 (Forbidden)
        console.warn(`Access denied. Required role: ${requiredRole}, User role: ${userRole}`);
        return <Navigate to="/" replace state={{ message: 'Bạn không có đủ quyền truy cập.' }} />;
    }


    // Nếu đã đăng nhập VÀ có quyền, hiển thị nội dung trang (Outlet là component con)
    return <Outlet />;
};

export default ProtectedRoute;
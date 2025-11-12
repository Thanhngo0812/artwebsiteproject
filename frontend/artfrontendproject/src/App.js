import React from "react";
import { AuthProvider } from './context/AuthContext';
//protectroute
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
//trang chưa đăng nhập
import MainLayout from "./components/MainLayout";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import VerifyOTP from "./pages/auth/VerifyOTP";
// trang admin
import AdminLayout from "./components/AdminLayout";
import Product from "./pages/admin/Product";
import User from "./pages/admin/User";
import ProductUser from "./components/ProductUser";
import Dashboard from "./pages/admin/Dashboard";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPassword"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import "./assets/css/global.css";
import Cart from "./components/Cart";
import VerifyPasswordOTP from "./pages/auth/VerifyPasswordOTP";
import ResetPasswordPage from "./pages/auth/ResetPassword";
import UserProfilePage from "./pages/user/UserProfilePage";

function App() {
  return (
    //  <AuthProvider>
    <AuthProvider> 
    <BrowserRouter>
     
   
      <div className="App" >
        <Routes>
          {/*trang chưa đăng nhập*/}
          <Route element={<PublicRoute />}>
          <Route path="/" element={<MainLayout />}>
            {/* nên sử dụng index thay cho path="" */}
            <Route index element={<HomePage />} />
            <Route path="cart" element={<Cart />} />
            <Route path="products" element={<ProductUser />} />
            </Route>
          </Route>
          {/*trang đăng nhập/ đăng kí*/}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify-otp" element={<VerifyOTP/>}/>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-password-otp" element={<VerifyPasswordOTP />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />


          <Route path="/user" element={<ProtectedRoute requiredRole="ROLE_USER" />}>
          <Route path="profile" element={<UserProfilePage />} />
          </Route>

          
          <Route path="/admin/login" element={<LoginPage />} />
          {/*admin*/}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="product" element={<Product />} />
            <Route path="user" element={<User />} />
          </Route>
        </Routes>
        <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      </div>
    
    </BrowserRouter>
     </AuthProvider>
  );
}

export default App;

import React from "react";
import { AuthProvider } from './context/AuthContext';
//protectroute
import ProtectedRoute from "./components/routes/ProtectedRoute";
import PublicRoute from "./components/routes/PublicRoute";
//trang chưa đăng nhập
import MainLayout from "./components/layout/MainLayout/MainLayout";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/Login/LoginPage";
import VerifyOTP from "./pages/auth/VerifyOTP/VerifyOTP";
// trang admin
import AdminLayout from "./components/layout/AdminLayout/AdminLayout";
import Product from "./pages/admin/ProductManagement/Product";
import User from "./pages/admin/UserManagement/User";
import ProductUser from "./components/product/ProductUser/ProductUser";
import Dashboard from "./pages/admin/Dashboard/Dashboard";
import RegisterPage from "./pages/auth/Register/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPassword/ForgotPassword";
import ProfilePage from "./pages/profile/ProfilePage";
import UserProfilePage from "./pages/user/UserProfilePage";
import ProductDetail from "./pages/product/ProductDetail/ProductDetail";
import ProductListPage from "./pages/product/ProductList/ProductListPage";
import CheckoutPage from "./pages/checkout/CheckoutPage";
import PaymentCallback from "./pages/checkout/PaymentCallback";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import "./assets/css/global.css";
import Cart from "./components/cart/Cart/Cart";
import VerifyPasswordOTP from "./pages/auth/VerifyOTP/VerifyPasswordOTP";
import ResetPasswordPage from "./pages/auth/ResetPassword/ResetPassword";
import ProductAdmin_Add from "./pages/admin/ProductManagement/ProductAdmin_Add";

function App() {
  return (
    <AuthProvider> 
      <BrowserRouter>
        <div className="App">
          <Routes>
            {/*trang chưa đăng nhập*/}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="cart" element={<Cart />} />
              <Route path="products" element={<ProductUser />} />
              <Route path="products/:id" element={<ProductDetail />} />
              <Route path="products/search" element={<ProductListPage />} />
               <Route path="checkout" element={<CheckoutPage />} />

            </Route>

            {/*trang đăng nhập/ đăng kí*/}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/verify-password-otp" element={<VerifyPasswordOTP />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
            </Route>

            {/* ← ← ← ROUTE OTP (KHÔNG PROTECTED) */}
            <Route path="/verify-otp" element={<VerifyOTP />} />

            {/* ← ← ← ROUTE USER (CẦN LOGIN) */}
            <Route element={<ProtectedRoute requiredRole="ROLE_USER" />}>
              <Route path="/user/profile" element={<UserProfilePage />} />
              <Route path="/user/paymentcallback" element={<PaymentCallback />} />
            </Route>


            {/* ← ← ← ROUTE ADMIN (CẦN LOGIN + ROLE_ADMIN) */}
            {/* <Route element={<ProtectedRoute requiredRole="ROLE_ADMIN" />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="product" element={<Product />} />
                <Route path="user" element={<User />} />
                <Route path="product/new" element={<ProductAdmin_Add />} />
              </Route>
            </Route> */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="product" element={<Product />} />
              <Route path="user" element={<User />} />
              <Route path="product/new" element={<ProductAdmin_Add/>}/>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
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
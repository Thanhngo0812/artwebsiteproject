import React from "react";
//trang chưa đăng nhập
import MainLayout from "./components/MainLayout";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/LoginPage";

// trang admin
import AdminLayout from "./components/AdminLayout"
import Product from "./pages/admin/Product";
import Dashboard from "./pages/admin/Dashboard"
import RegisterPage from "./pages/auth/RegisterPage";

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "./assets/css/global.css";
import Cart from "./components/Cart";

function App() {
  return (
    //  <AuthProvider> 
     <BrowserRouter>
     <div className="App">
       <Routes>
        {/*trang chưa đăng nhập*/}
         <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<Cart />} />
        </Route>
        {/*trang đăng nhập*/}
         <Route path="/login" element={<LoginPage />} />
         <Route path="/register" element={<RegisterPage />} />
         <Route path="/admin" element={<LoginPage />} />
        {/*admin*/}
        <Route path="/admin" element={<AdminLayout />}>
        <Route path="" element={<Dashboard />} />
        <Route path="product" element={<Product />} />
         </Route>

       </Routes>
      </div>
     </BrowserRouter>
     // </AuthProvider> 
  );
}

export default App;

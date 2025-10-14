import React from "react";
import MainLayout from "./components/MainLayout";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/LoginPage";
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

       </Routes>
      </div>
     </BrowserRouter>
     // </AuthProvider> 
  );
}

export default App;

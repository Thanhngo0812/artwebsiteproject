import React from "react";
import MainLayout from "./components/MainLayout";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "./assets/css/global.css";

function App() {
  return (
    //  <AuthProvider> 
     <BrowserRouter>
     <div className="App">
       <Routes>
        {/*trang chưa đăng nhập*/}
         <Route element={<MainLayout />}>
         <Route path="/" element={<HomePage />} />
         </Route>
        {/*trang đăng nhập*/}
         <Route path="/login" element={<LoginPage />} />

       </Routes>
        </div>
     </BrowserRouter>
     // </AuthProvider> 
  );
}

export default App;

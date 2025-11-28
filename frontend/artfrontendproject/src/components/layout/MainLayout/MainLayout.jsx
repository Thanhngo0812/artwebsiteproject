// src/components/MainLayout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import "./MainLayout.css";

import FloatingChatbot from '../../common/FloatingChatbot/FloatingChatbot';

const MainLayout = () => {
  return (
    <div className="main-layout">
      <Header />
      <main className="main-content">

        <Outlet />
      </main>
      <FloatingChatbot />
      <Footer />
    </div>
  );
};

export default MainLayout;

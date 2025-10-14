// src/components/MainLayout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
 

const AdminLayout = () => {
  return (
    <>
      {/* <Header />  
      <Sidebar />*/}
      <main>
        <Outlet /> 
      </main>
    </>
  );
};

export default AdminLayout;
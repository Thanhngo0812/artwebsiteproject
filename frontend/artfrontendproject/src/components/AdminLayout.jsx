import React from "react";
import { Outlet } from "react-router-dom";
import Adminheader from "../pages/admin/components/Adminheader";
import Adminsidebar from "../pages/admin/components/Adminsidebar";
import "./css/AdminLayout.css";

const AdminLayout = () => {
  return (
    <>
      <div className="admin-container">
        <Adminsidebar />
        <div className="header-content-container">
          <Adminheader />
          <main className="content-container">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;

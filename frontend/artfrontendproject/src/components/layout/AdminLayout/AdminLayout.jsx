import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Adminheader from "./Adminheader";
import Adminsidebar from "./Adminsidebar";
import "./AdminLayout.css";

const AdminLayout = () => {
  const [openSidebar, setOpenSidebar] = useState(true); // thu nhỏ / mở rộng sidebar (desktop)
  const [showSidebar, setShowSidebar] = useState(false); // hiện sidebar trên mobile
  const [changeIcon, setChangeIcon] = useState(false); // thay dổi icon ẩn hiện sidebar

  const toggleSidebar = () => {
    if (window.innerWidth <= 1024) {
      // mobile
      setShowSidebar(!showSidebar);
      // change icon farbars
      setChangeIcon(!changeIcon);
    } else {
      // desktop
      setOpenSidebar(!openSidebar);
    }
  };

  // Khi đổi kích thước cửa sổ, ẩn sidebar nếu đang ở mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setShowSidebar(false);
        setChangeIcon(false);
      } else {
        setOpenSidebar(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div className="admin-container">
        <Adminsidebar
          openSidebar={openSidebar}
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
        />
        <div className="header-content-container">
          <Adminheader toggleSidebar={toggleSidebar} changeIcon={changeIcon} />
          <main className="content-container">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;

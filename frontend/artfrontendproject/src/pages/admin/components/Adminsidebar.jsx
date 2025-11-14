import React from "react";
import "../css/Adminsidebar.scss";
import { FaChartBar, FaChartLine, FaBoxOpen, FaUsers, FaTags } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";

export default function Adminsidebar({ openSidebar, showSidebar, setShowSidebar }) {
  const menuItem = [
    { path: "", name: "Dashboard", icon: <FaChartLine /> },
    { path: "product", name: "Products", icon: <FaBoxOpen /> },
    { path: "user", name: "Users", icon: <FaUsers /> },
    { path: "category", name: "Categories", icon: <FaTags /> },
  ];

  return (
    <>
      {/* Overlay (khi mở sidebar trên mobile) */}
      {showSidebar && <div className="sidebar-overlay" onClick={() => setShowSidebar(false)}></div>}

      <div
        className={`sidebar-container ${!openSidebar ? "close" : ""} ${
          showSidebar ? "show-mobile" : ""
        }`}
      >
        <div className="sidebar-header">
          <div className="logo">
            <Link to="">
              <FaChartBar className="icon-chartBar" />
            </Link>
          </div>
          <div
            className="logo-name"
            style={{ display: openSidebar ? "block" : "none" }}
          >
            Tranh Xịn
          </div>
        </div>

        <div className="sidebar-body">
          {menuItem.map((item, index) => (
            <NavLink
              to={item.path}
              end
              key={index}
              className={({ isActive }) =>
                isActive ? "nav-items active" : "nav-items"
              }
              onClick={() => setShowSidebar(false)} // ẩn sidebar khi click menu (mobile)
            >
              <div className="icon">{item.icon}</div>
              <div
                className="name"
                style={{ display: openSidebar ? "block" : "none" }}
              >
                {item.name}
              </div>
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
}

import React from "react";
import "./Adminsidebar.scss";
import { FaChartBar, FaChartLine, FaBoxOpen, FaUsers, FaTruck, FaReceipt, FaTags, FaShoppingCart, FaGift,FaPercentage, FaSignOutAlt } from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

export default function Adminsidebar({ openSidebar, showSidebar, setShowSidebar }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('username');
        navigate("/login");

  
  };
  const menuItem = [
    { path: "", name: "Dashboard", icon: <FaChartLine /> },
    { path: "product", name: "Products", icon: <FaBoxOpen /> },
    { path: "suppliers", name: "Suppliers", icon: <FaTruck /> },
    { path: "goods-receipts", name: "Goods Receipts", icon: <FaReceipt /> },
    { path: "user", name: "Users", icon: <FaUsers /> },
    { path: "category", name: "Category", icon: <FaTags /> },
    { path: "order", name: "Orders", icon: <FaShoppingCart /> },
    { path: "promotion", name: "Promotions", icon: <FaGift /> },
    { path: "promotionapply", name: "Promotion Products", icon: <FaPercentage /> },
      { path: "statistics-detail", name: "Statistics Detail", icon: <FaChartBar /> },

  ];

  return (
    <>
      {/* Overlay (khi mở sidebar trên mobile) */}
      {showSidebar && <div className="sidebar-overlay" onClick={() => setShowSidebar(false)}></div>}

      <div
        className={`sidebar-container ${!openSidebar ? "close" : ""} ${showSidebar ? "show-mobile" : ""
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

          <div
            className="nav-items logout"
            onClick={handleLogout}
            style={{ cursor: "pointer", marginTop: "20px", borderTop: "1px solid rgba(255,255,255,0.1)" }}
          >
            <div className="icon"><FaSignOutAlt /></div>
            <div
              className="name"
              style={{ display: openSidebar ? "block" : "none" }}
            >
              Đăng xuất
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

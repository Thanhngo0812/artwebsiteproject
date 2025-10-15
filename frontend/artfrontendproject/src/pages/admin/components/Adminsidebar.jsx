import React, { useState } from "react";
import "../css/Adminsidebar.scss";
import { FaBars, FaChartLine, FaBoxOpen } from "react-icons/fa";
import { NavLink } from "react-router-dom";

export default function Adminsidebar() {
  const [openSidebar, setOpenSidebar] = useState(true);
  const menuItem = [
    {
      path: "",
      name: "Dashboard",
      icon: <FaChartLine />,
    },
    {
      path: "product",
      name: "Products",
      icon: <FaBoxOpen />,
    },
  ];
  const toggleSidebar = () => {
    setOpenSidebar(!openSidebar);
  };
  return (
    <div className={`sidebar-container ${!openSidebar ? "close" : ""}`}>
      <div className="sidebar-header">
        <div
          className={`icon-fabars ${!openSidebar ? "close" : ""}`}
          onClick={toggleSidebar}
        >
          <FaBars />
        </div>
        <div
          className="logo"
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
  );
}

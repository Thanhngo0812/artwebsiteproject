import React from "react";
import "../css/Adminheader.css";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Adminheader({ toggleSidebar, changeIcon }) {
  return (
    <div className="header-container">
      {!changeIcon ? (
        <div className="icon-fabars" onClick={toggleSidebar}>
          <FaBars />
        </div>
      ) : (
        <div className="icon-fatimes" onClick={toggleSidebar}>
          <FaTimes />
        </div>
      )}
    </div>
  );
}

import "./css/Header.css";
import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

export default function Header() {
  const [categories, setCategories] = useState([]);
  const [children, setChildren] = useState({});
  const [openIndex, setOpenIndex] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8888/api/v1/categories/parents")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => console.log(error.message));
  }, []);

  const handleCategoryClick = (cat, idx) => {
    if (openIndex === idx) {
      setOpenIndex(null);
      return;
    }
    setOpenIndex(idx);
    if (cat && cat.id && !children[cat.id]) {
      fetch(`http://localhost:8888/api/v1/categories/${cat.id}/children`)
        .then((res) => res.json())
        .then((data) => {
          setChildren((prev) => ({ ...prev, [cat.id]: data }));
        }).catch((error) => console.log(error));
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <nav className="nav">
        <div className="nav-left">
          <Link to="/" className="nav-logo">
            <img
              src="/logo.png"
              alt="Logo"
              style={{ height: 36, width: "auto" }}
            />
          </Link>
          <button className="hamburger" onClick={toggleMenu}>
            <span className={isMenuOpen ? "active" : ""}></span>
            <span className={isMenuOpen ? "active" : ""}></span>
            <span className={isMenuOpen ? "active" : ""}></span>
          </button>
          <ul className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
            <li>
              <Link to="/products" className="nav-item shop" onClick={() => setIsMenuOpen(false)}>
                Shop
              </Link>
            </li>
            {categories.map((cat, idx) => (
              <li key={cat.id}>
                <div
                  className="nav-item category"
                  tabIndex={0}
                  onClick={() => handleCategoryClick(cat, idx)}
                  onBlur={() => setOpenIndex(null)}
                >
                  <span className={openIndex === idx ? "active" : ""}>{cat.name}</span>
                  {openIndex === idx && (
                    <div className="dropdown">
                      {(children[cat.id] || []).map((child) => (
                        <div className="dropdown-item" key={child.id} onClick={() => setIsMenuOpen(false)}>
                          {child.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="nav-right">
          <button className="icon-button">
            <img src="/search.png" alt="Search" className="nav-icon" />
          </button>
          <Link to="/login" className="icon-button">
            <img src="/user.png" alt="User" className="nav-icon" />
          </Link>
          <Link to="/cart" className="icon-button">
            <img src="/cart.png" alt="Cart" className="nav-icon" />
          </Link>
        </div>
      </nav>
    </header>
  );
}
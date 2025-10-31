import "./css/Header.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Header() {
  const [categories, setCategories] = useState([]);
  const [children, setChildren] = useState({});
  const [openIndex, setOpenIndex] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8888/api/v1/categories/parents")
      .then((res) => res.json())
      .then((data) => setCategories(data))
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
        })
        .catch((error) => console.log(error));
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 990) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navigateLogin = useNavigate();
  const handleNavigateLogin = () => {
    navigateLogin("/login");
  };

  return (
    <header className="header">
      <div className={`nav-sidebar ${menuOpen ? "active" : ""}`}>
        <ul className="nav-sidebar-menu">
          {Array(30)
            .fill(0)
            .map((_, i) => (
              <li key={i}>
                <a href="/products" className="nav-sidebar-item">
                  Shop
                </a>
              </li>
            ))}

          {categories.map((cat, idx) => (
            <li key={cat.id}>
              <div
                className="nav-sidebar-item-category"
                tabIndex={0}
                onClick={() => handleCategoryClick(cat, idx)}
                onBlur={() => setOpenIndex(null)}
              >
                <span className={openIndex === idx ? "active" : ""}>
                  {cat.name}
                </span>
                {openIndex === idx && (
                  <div className="dropdown">
                    {(children[cat.id] || []).map((child) => (
                      <div className="dropdown-item" key={child.id}>
                        {child.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>

        <div className="footer-sidebar">
          <div className="footer-sidebar-login" onClick={handleNavigateLogin}>
            <img src="/user.png" alt="User" className="nav-sidebar-icon" />
            <span>Đăng Nhập</span>
          </div>
          <div> icon: facebook, youtube,...</div>
        </div>
      </div>

      <nav className="nav">
        <button
          className={`hamburger ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className="nav-logo">
          <Link to="/" style={{ display: "flex", alignItems: "center" }}>
            <img src="/logo.png" alt="Logo" />
          </Link>
        </div>

        <div className="nav-center">
          <ul className="nav-menu">
            <li>
              <a href="/products" className="nav-item shop">
                Shop
              </a>
            </li>

            {categories.map((cat, idx) => (
              <li key={cat.id}>
                <div
                  className="nav-item category"
                  tabIndex={0}
                  onClick={() => handleCategoryClick(cat, idx)}
                  onBlur={() => setOpenIndex(null)}
                >
                  <span className={openIndex === idx ? "active" : ""}>
                    {cat.name}
                  </span>
                  {openIndex === idx && (
                    <div className="dropdown">
                      {(children[cat.id] || []).map((child) => (
                        <div className="dropdown-item" key={child.id}>
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

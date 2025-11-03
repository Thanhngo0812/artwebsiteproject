import "./css/Header.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Header() {
  const [categories, setCategories] = useState([]);
  const [children, setChildren] = useState({});
  const [openIndex, setOpenIndex] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchCategoriesAndChildren = async () => {
      try {
        const res = await fetch(
          "http://localhost:8888/api/v1/categories/parents"
        );
        const parentsData = await res.json();
        setCategories(parentsData);

        const newChildrenMap = {};
        const fetchChildrenPromises = parentsData.map(async (parent) => {
          try {
            const response = await axios.get(
              `http://localhost:8888/api/v1/categories/${parent.id}/children`
            );
            if (response.data && response.data.length > 0) {
              newChildrenMap[parent.id] = response.data;
            }
          } catch (error) {
            console.log(
              `Error fetching children for ${parent.id}:`,
              error.message
            );
          }
        });

        await Promise.all(fetchChildrenPromises);
        setChildrenMap(newChildrenMap);
      } catch (error) {
        console.log("Error fetching parent categories:", error.message);
      }
    };

    fetchCategoriesAndChildren();
  }, []);

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

  const navigateShop = useNavigate();
  const handleToShop = () => {
    setActiveParentId(null);
    navigateShop("/products");
    setMenuOpen(false);
  };

  const handleCategoryChildOpen = () => {
    setActiveParentId(null);
  };

  const navigateCategoryParent = useNavigate();
  const handleParentClick = (parentId, parentName) => {
    if (childrenMap[parentId] && childrenMap[parentId].length > 0) {
      setActiveParentId(activeParentId === parentId ? null : parentId);
    } else {
      setActiveParentId(null);
      navigateCategoryParent(`/products?category=${parentName}`);
      setMenuOpen(false);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className={`nav-sidebar ${menuOpen ? "active" : ""}`}>
        <ul className="nav-sidebar-menu">
          <li onClick={handleToShop}>
            <div className="nav-sidebar-item shop">Shop</div>
          </li>

          {categories.map((item) => {
            const hasChildren =
              childrenMap[item.id] && childrenMap[item.id].length > 0;

            return (
              <li key={item.id}>
                <div
                  className="nav-sidebar-item category"
                  onClick={() => handleParentClick(item.id, item.name)}
                >
                  <span>{item.name}</span> {hasChildren && <span>&#9660;</span>}
                </div>

                {activeParentId === item.id && hasChildren && (
                  <ul className="nav-sidebar-children-menu">
                    {childrenMap[item.id].map((child) => (
                      <li key={child.id}>
                        <Link
                          to={`/products?category=${child.name}`}
                          className="nav-sidebar-child-item"
                          onClick={() => setMenuOpen(false)}
                        >
                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
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

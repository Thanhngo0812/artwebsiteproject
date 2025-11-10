import "./css/Header.css";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Header() {
  const [categories, setCategories] = useState([]);
  const [childrenMap, setChildrenMap] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeParentId, setActiveParentId] = useState(null);
  const [activeSidebarParentId, setActiveSidebarParentId] = useState(null);
  const dropdownRef = useRef(null);

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
        setActiveSidebarParentId(null);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveParentId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navigateLogin = useNavigate();
  const handleNavigateLogin = () => {
    navigateLogin("/login");
    setMenuOpen(false);
  };

  const navigateShop = useNavigate();
  const handleToShop = () => {
    setActiveParentId(null);

    const unique = Date.now(); // hoặc Math.random()
    navigateShop(`/products?reset=true&_=${unique}`);
    setActiveSidebarParentId(null);
    navigateShop("/products");
    setMenuOpen(false);

    
  };

  const handleCategoryChildOpen = () => {
    const unique = Date.now();
    setActiveParentId(null);
    setMenuOpen(false);
    window.location.href = `/products?reset=true&_=${unique}`;
  };

  const navigateCategoryParent = useNavigate();
  
  const handleParentClick = (parentId, parentName) => {
    const hasChildren = childrenMap[parentId] && childrenMap[parentId].length > 0;
    
    if (hasChildren) {
      setActiveParentId(activeParentId === parentId ? null : parentId);
    } else {
      setActiveParentId(null);
      navigateCategoryParent(`/products?category=${parentName}`);
    }
  };

  const handleSidebarParentClick = (parentId, parentName) => {
    const hasChildren = childrenMap[parentId] && childrenMap[parentId].length > 0;
    
    if (hasChildren) {
      setActiveSidebarParentId(activeSidebarParentId === parentId ? null : parentId);
    } else {
      setActiveSidebarParentId(null);
      navigateCategoryParent(`/products?category=${parentName}`);
      setMenuOpen(false);
    }
  };

  const handleChildClick = () => {
    setActiveParentId(null);
    setActiveSidebarParentId(null);
    setMenuOpen(false);
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
                  onClick={() => handleSidebarParentClick(item.id, item.name)}
                >
                  <span>{item.name}</span> 
                  {hasChildren && (
                    <span className={`arrow ${activeSidebarParentId === item.id ? 'active' : ''}`}>
                      &#9660;
                    </span>
                  )}
                </div>

                {activeSidebarParentId === item.id && hasChildren && (
                  <ul className="nav-sidebar-children-menu">
                    {childrenMap[item.id].map((child) => (
                      <li key={child.id}>
                        <Link
                          to={`/products?category=${child.name}`}
                          className="nav-sidebar-child-item"
                          onClick={handleChildClick}
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
          <Link to="/" style={{ display: "flex", alignItems: "center" }} onClick={() => setMenuOpen(false)}>
            <img src="/logo.png" alt="Logo" />
          </Link>
        </div>

        <div className="nav-center">
          <ul className="nav-menu" ref={dropdownRef}>
            <li>
              <Link
                to="#"
                className="nav-item shop"
                onClick={handleCategoryChildOpen}
              >
                Shop
              </Link>
            </li>

            {categories.map((item) => {
              const hasChildren =
                childrenMap[item.id] && childrenMap[item.id].length > 0;

              return (
                <li key={item.id} className="nav-menu-item">
                  <div
                    className="nav-item category"
                    onClick={() => handleParentClick(item.id, item.name)}
                  >
                    <span>{item.name}</span>
                    {hasChildren && (
                      <span className={`arrow ${activeParentId === item.id ? 'active' : ''}`}>
                        
                      </span>
                    )}
                  </div>
                  
                  {activeParentId === item.id && hasChildren && (
                    <ul className="nav-item-children-menu">
                      {childrenMap[item.id].map((child) => (
                        <li key={child.id}>
                          <Link
                            to={`/products?category=${child.name}`}
                            className="nav-item-child-item"
                            onClick={handleChildClick}
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
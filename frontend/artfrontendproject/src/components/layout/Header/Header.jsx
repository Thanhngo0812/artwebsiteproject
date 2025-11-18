import "./Header.css";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FaChevronDown,
  FaChevronUp,
  FaSearch,
  FaTimes,
  FaUser,
  FaHistory,
  FaSignOutAlt
} from "react-icons/fa";

export default function Header() {
  const [categories, setCategories] = useState([]);
  const [childrenMap, setChildrenMap] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeParentId, setActiveParentId] = useState(null);
  const [activeSidebarParentId, setActiveSidebarParentId] = useState(null);
  
  // Ref cho danh mục sản phẩm
  const dropdownRef = useRef(null);
  // --- Ref mới cho User Dropdown ---
  const userDropdownRef = useRef(null);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isContentOverlayActive, setIsContentOverlayActive] = useState(false);

  // --- State tìm kiếm ---
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // --- State mới để lưu tên người dùng ---
  const [username, setUsername] = useState(""); 
  // --- State mới để bật tắt menu User ---
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navigate = useNavigate();

  // --- Cập nhật useEffect checkAuth để lấy tên người dùng ---
  useEffect(() => {
    const checkAuth = () => {
      const userStr = localStorage.getItem('username');
      if (userStr) {
        setIsLoggedIn(true);
        try {
          // Thử parse JSON nếu 'user' lưu dạng object { token:..., username:... }
          // Ưu tiên lấy các trường tên thông dụng
          const name = userStr || "Bạn";
          setUsername(name);
        } catch (e) {
          // Nếu không phải JSON (ví dụ chỉ lưu token string), set mặc định
          setUsername("Bạn");
        }
      } else {
        setIsLoggedIn(false);
        setUsername("");
      }
    };
    
    checkAuth();
    
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  // ... (Giữ nguyên formatCurrency) ...
  const formatCurrency = (amount) => {
    if (typeof amount !== "number") return "";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // ... (Giữ nguyên useEffect fetchCategoriesAndChildren) ...
  useEffect(() => {
    const fetchCategoriesAndChildren = async () => {
      try {
        const res = await fetch("http://localhost:8888/api/v1/categories/parents");
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
            console.log(`Error fetching children for ${parent.id}:`, error.message);
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

  // ... (Giữ nguyên handleResize) ...
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

  // ... (Giữ nguyên handleClickOutside) ...
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Đóng menu danh mục
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveParentId(null);
      }
      // Đóng menu user
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ... (Giữ nguyên useEffect tìm kiếm) ...
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const timerId = setTimeout(() => {
      const fetchSearchResults = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8888/api/products/suggest?keyword=${searchQuery}&limit=5`
          );
          setSearchResults(response.data);
        } catch (error) {
          console.error("Error fetching search results:", error);
          setSearchResults([]);
        } finally {
          setIsLoading(false);
        }
      };
      fetchSearchResults();
    }, 300);
    return () => clearTimeout(timerId);
  }, [searchQuery]);

  // --- LOGIC USER ACTION ---
  const navigateLogin = useNavigate();
  
  const handleUserIconClick = () => {
    if (isLoggedIn) {
      // Nếu đã đăng nhập -> Toggle menu
      setIsUserMenuOpen(!isUserMenuOpen);
    } else {
      // Chưa đăng nhập -> Chuyển trang login
      navigateLogin("/login");
      setMenuOpen(false);
    }
  };

  // Hàm đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername(""); // Xóa tên user
    setIsUserMenuOpen(false);
    navigateLogin("/");
  };

  // ... (Giữ nguyên các hàm điều hướng shop/category) ...
  const navigateShop = useNavigate();
  const handleToShop = () => {
    setActiveParentId(null);
    const unique = Date.now();
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

  // ... (Giữ nguyên logic search) ...
  const openSearch = () => {
    setIsSearchOpen(true);
    setTimeout(() => {
      setIsContentOverlayActive(true);
      document.body.style.overflow = "hidden";
    }, 100);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setIsContentOverlayActive(false);
    document.body.style.overflow = "";
    setSearchQuery("");
    setSearchResults([]);
    setIsLoading(false);
  };

  const handleSearchSubmit = (event) => {
    if (event.key === "Enter" && searchQuery.trim() !== "") {
      event.preventDefault();
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      closeSearch();
    }
  };

  const handleResultClick = () => {
    closeSearch();
  };

  return (
    <>
    <header className="header">
      <div className={`nav-sidebar ${menuOpen ? "active" : ""}`}>
        {/* ... (Giữ nguyên sidebar) ... */}
        <ul className="nav-sidebar-menu">
          <li onClick={handleToShop}>
            <div className="nav-sidebar-item shop">Shop</div>
          </li>
          {categories.map((item) => {
            const hasChildren = childrenMap[item.id] && childrenMap[item.id].length > 0;
            return (
              <li key={item.id}>
                <div
                  className="nav-sidebar-item category"
                  onClick={() => handleSidebarParentClick(item.id, item.name)}
                >
                  <span>{item.name}</span>
                  {hasChildren && (
                    <span className={`arrow ${activeSidebarParentId === item.id ? "active" : ""}`}>
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
          <div className="footer-sidebar-login" onClick={() => {
             if(isLoggedIn) navigate("/user/profile"); else navigate("/login");
          }}>
            <img src="/user.png" alt="User" className="nav-sidebar-icon" />
            <span>{isLoggedIn ? "Tài Khoản" : "Đăng Nhập"}</span>
          </div>
        </div>
      </div>

      <nav className="nav">
        {/* ... (Giữ nguyên hamburger và logo) ... */}
        <button className={`hamburger ${menuOpen ? "active" : ""}`} onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className="nav-logo">
          <Link to="/" style={{ display: "flex", alignItems: "center" }} onClick={() => setMenuOpen(false)}>
            <img src="/logo.png" alt="Logo" />
          </Link>
        </div>

        {/* ... (Giữ nguyên nav-center) ... */}
        <div className="nav-center">
          <ul className="nav-menu" ref={dropdownRef}>
            <li>
              <Link to="#" className="nav-item shop" onClick={handleCategoryChildOpen}>Shop</Link>
            </li>
            {categories.map((item) => {
              const hasChildren = childrenMap[item.id] && childrenMap[item.id].length > 0;
              return (
                <li key={item.id} className="nav-menu-item">
                  <div className="nav-item category" onClick={() => handleParentClick(item.id, item.name)}>
                    <span>{item.name}</span>
                    {hasChildren && (
                      <span className={`arrow ${activeParentId === item.id ? "active" : ""}`}>
                        {activeSidebarParentId === item.id ? <FaChevronUp style={{ paddingTop: "4px" }} /> : <FaChevronDown style={{ paddingTop: "4px" }} />}
                      </span>
                    )}
                  </div>
                  {activeParentId === item.id && hasChildren && (
                    <ul className="nav-item-children-menu">
                      {childrenMap[item.id].map((child) => (
                        <li key={child.id}>
                          <Link to={`/products?category=${child.name}`} className="nav-item-child-item" onClick={handleChildClick}>
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
          <button className="icon-button" onClick={openSearch}>
            <img src="/search.png" alt="Search" className="nav-icon" />
          </button>

          {/* --- KHU VỰC USER CẬP NHẬT --- */}
          <div className="user-menu-container" ref={userDropdownRef} style={{ position: 'relative' }}>
            <button className="icon-button" onClick={handleUserIconClick}>
              <img src="/user.png" alt="User" className="nav-icon" />
            </button>
            
            {/* Tooltip hiện khi hover (chỉ hiện khi menu không mở) */}
            {!isUserMenuOpen && (
              <div className="user-hover-tooltip">
                {isLoggedIn ? `Xin chào, ${username}` : "Đăng nhập/Đăng kí ngay"}
              </div>
            )}

            {/* Menu Dropdown */}
            {isLoggedIn && isUserMenuOpen && (
              <div className="user-dropdown-menu">
                <div className="user-dropdown-arrow"></div>
                <Link to="/user/profile" className="user-dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                  <FaUser className="dropdown-icon" /> Thông tin cá nhân
                </Link>
                <Link to="/user/orders" className="user-dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                  <FaHistory className="dropdown-icon" /> Lịch sử đơn hàng
                </Link>
                <div className="user-dropdown-divider"></div>
                <button className="user-dropdown-item logout-btn" onClick={handleLogout}>
                  <FaSignOutAlt className="dropdown-icon" /> Đăng xuất
                </button>
              </div>
            )}
          </div>

          <Link to="/cart" className="icon-button">
            <img src="/cart.png" alt="Cart" className="nav-icon" />
          </Link>
        </div>
      </nav>

      {/* ... (Giữ nguyên search overlay) ... */}
      <div className={`content-overlay ${isContentOverlayActive ? "active" : ""}`} onClick={closeSearch}></div>
      <div className={`search-header-overlay ${isSearchOpen ? "active" : ""}`}>
        <div className="search-box-container">
          <div className="search-box">
            <input
              type="text"
              className="search-input"
              placeholder="Tìm kiếm..."
              autoFocus={isSearchOpen}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchSubmit}
            />
            <button className="search-icon-btn"><FaSearch /></button>
            <button className="search-close-btn" onClick={closeSearch}><FaTimes /></button>
          </div>
          {searchQuery.trim() !== "" && (
            <div className="search-results-dropdown">
              {isLoading ? (
                <div className="search-result-item loading">Đang tìm kiếm...</div>
              ) : searchResults.length > 0 ? (
                searchResults.map((product) => (
                  <Link key={product.id} to={`/products/${product.id}`} className="search-result-item" onClick={handleResultClick}>
                    <img src={product.thumbnail} alt={product.productName} />
                    <div className="search-result-info">
                      <span className="search-result-name">{product.productName}</span>
                      <div className="search-result-price-container">
                        {product.promotionalPrice && product.promotionalPrice > 0 ? (
                          <>
                            <span className="search-result-price sale">{formatCurrency(product.promotionalPrice)}</span>
                            <span className="search-result-price original">{formatCurrency(product.originalPrice)}</span>
                          </>
                        ) : (
                          <span className="search-result-price">{formatCurrency(product.originalPrice)}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="search-result-item no-results">Không tìm thấy kết quả nào.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
    </>
  );
}
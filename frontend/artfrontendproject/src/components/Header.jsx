import "./css/Header.css";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FaChevronDown,
  FaChevronUp,
  FaSearch,
  FaTimes,
} from "react-icons/fa";

export default function Header() {
  const [categories, setCategories] = useState([]);
  const [childrenMap, setChildrenMap] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeParentId, setActiveParentId] = useState(null);
  const [activeSidebarParentId, setActiveSidebarParentId] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isContentOverlayActive, setIsContentOverlayActive] = useState(false);

  // --- State mới cho chức năng tìm kiếm ---
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Hook để điều hướng
  const formatCurrency = (amount) => {
    if (typeof amount !== "number") {
      return "";
    }
    // Định dạng tiền tệ kiểu Việt Nam (VND)
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0, // Bỏ phần ,00
    }).format(amount);
  };
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

  // --- useEffect mới để fetch API tìm kiếm (Debounce) ---
  useEffect(() => {
    // Nếu ô tìm kiếm rỗng, dọn dẹp kết quả
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // Tạo timer
    const timerId = setTimeout(() => {
      const fetchSearchResults = async () => {
        try {
          // *** THAY ĐỔI URL NÀY thành endpoint API tìm kiếm của bạn ***
          const response = await axios.get(
            `http://localhost:8888/api/products/suggest?keyword=${searchQuery}&limit=5`
          );
          
          setSearchResults(response.data);
        } catch (error) {
          console.error("Error fetching search results:", error);
          setSearchResults([]); // Xóa kết quả nếu lỗi
        } finally {
          setIsLoading(false);
        }
      };

      fetchSearchResults();
    }, 300); // Chờ 300ms sau khi người dùng ngừng gõ

    // Cleanup: Hủy timer cũ nếu người dùng gõ tiếp
    return () => {
      clearTimeout(timerId);
    };
  }, [searchQuery]); // Chạy lại khi searchQuery thay đổi

  const navigateLogin = useNavigate();
  const handleNavigateLogin = () => {
    navigateLogin("/login");
    setMenuOpen(false);
  };

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
      setActiveSidebarParentId(
        activeSidebarParentId === parentId ? null : parentId
      );
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

  // Hàm mở thanh tìm kiếm
  const openSearch = () => {
    setIsSearchOpen(true);
    setTimeout(() => {
      setIsContentOverlayActive(true);
      document.body.style.overflow = "hidden";
    }, 100);
  };

  // Hàm đóng thanh tìm kiếm (cập nhật)
  const closeSearch = () => {
    setIsSearchOpen(false);
    setIsContentOverlayActive(false);
    document.body.style.overflow = "";

    // Reset state tìm kiếm khi đóng
    setSearchQuery("");
    setSearchResults([]);
    setIsLoading(false);
  };

  // --- Hàm mới: Xử lý nhấn Enter ---
  const handleSearchSubmit = (event) => {
    if (event.key === "Enter" && searchQuery.trim() !== "") {
      event.preventDefault(); // Ngăn submit form (nếu có)
      
      // Chuyển trang với query
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      
      // Đóng và reset
      closeSearch();
    }
  };

  // --- Hàm mới: Xử lý khi nhấp vào kết quả ---
  const handleResultClick = () => {
    // Chỉ cần đóng, <Link> sẽ tự điều hướng
    closeSearch();
  };

  return (
    <>
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
                    <span
                      className={`arrow ${
                        activeSidebarParentId === item.id ? "active" : ""
                      }`}
                    >
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
          <Link
            to="/"
            style={{ display: "flex", alignItems: "center" }}
            onClick={() => setMenuOpen(false)}
          >
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
                      <span
                        className={`arrow ${
                          activeParentId === item.id ? "active" : ""
                        }`}
                      >
                        {activeSidebarParentId === item.id ? (
                          <FaChevronUp style={{ paddingTop: "4px" }} />
                        ) : (
                          <FaChevronDown style={{ paddingTop: "4px" }} />
                        )}
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
          <button className="icon-button" onClick={openSearch}>
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

      {/* OVERLAY NỘI DUNG DƯỚI HEADER */}
      <div
        className={`content-overlay ${isContentOverlayActive ? "active" : ""}`}
        onClick={closeSearch}
      ></div>

      {/* OVERLAY THANH TÌM KIẾM (Đã cập nhật) */}
      <div className={`search-header-overlay ${isSearchOpen ? "active" : ""}`}>
        <div className="search-box-container">
          <div className="search-box">
            <input
              type="text"
              className="search-input"
              placeholder="Tìm kiếm..."
              autoFocus={isSearchOpen}
              
              // --- Cập nhật input ---
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchSubmit} // Xử lý Enter
            />
            <button className="search-icon-btn">
              <FaSearch />
            </button>
            <button className="search-close-btn" onClick={closeSearch}>
              <FaTimes />
            </button>
          </div>

          {/* --- Dropdown kết quả tìm kiếm --- */}
          {/* Chỉ hiển thị dropdown nếu có query */}
          {searchQuery.trim() !== "" && (
            <div className="search-results-dropdown">
              {isLoading ? (
                <div className="search-result-item loading">Đang tìm kiếm...</div>
              ) : searchResults.length > 0 ? (
                searchResults.map((product) => (
                  // *** Cập nhật `to` thành link chi tiết sản phẩm của bạn ***
                  // Ví dụ: /products/123
                  <Link
  key={product.id}
  to={`/products/${product.id}`}
  className="search-result-item"
  onClick={handleResultClick}
>
  <img 
    src={product.thumbnail} 
    alt={product.productName} 
  />

  {/* Container mới cho thông tin (tên + giá) */}
  <div className="search-result-info">
    <span className="search-result-name">{product.productName}</span>

    {/* Container cho giá */}
    <div className="search-result-price-container">
      {/* Kiểm tra xem CÓ giá khuyến mãi (promotionalPrice) 
        và giá đó > 0 không 
      */}
      {product.promotionalPrice && product.promotionalPrice > 0 ? (
        <>
          {/* Giá sale */}
          <span className="search-result-price sale">
            {formatCurrency(product.promotionalPrice)}
          </span>
          {/* Giá gốc (bị gạch) */}
          <span className="search-result-price original">
            {formatCurrency(product.originalPrice)}
          </span>
        </>
      ) : (
        // Nếu không có sale, chỉ hiện giá gốc
        <span className="search-result-price">
          {formatCurrency(product.originalPrice)}
        </span>
      )}
    </div>
  </div>
</Link>
                ))
              ) : (
                // Không loading, không có kết quả
                <div className="search-result-item no-results">
                  Không tìm thấy kết quả nào.
                </div>
              )}
            </div>
          )}
          {/* --- Kết thúc dropdown --- */}

        </div>
      </div>
    </header>
    </>
  );
}
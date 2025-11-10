import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/SearchBar.css';

export default function SearchBar({ isOpen, onClose }) {
  const [keyword, setKeyword] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Auto focus
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // ESC key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Debounce search
  useEffect(() => {
    if (!keyword.trim()) {
      setSuggestions([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      fetchSuggestions(keyword);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [keyword]);

  const fetchSuggestions = async (query) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8888/api/products/search-query?q=${encodeURIComponent(query)}&limit=5`
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('❌ Search error:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products/search?q=${encodeURIComponent(keyword)}`);
      onClose();
      setKeyword('');
      setSuggestions([]);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
    onClose();
    setKeyword('');
    setSuggestions([]);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (!isOpen) return null;

  return (
    <div className="search-overlay">
      <div className="search-container" ref={searchRef}>
        <form onSubmit={handleSubmit} className="search-form">
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="Tìm kiếm sản phẩm..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button type="submit" className="search-submit-btn">
            <img src="/search.png" alt="Search" />
          </button>
          <button type="button" className="search-close-btn" onClick={onClose}>
            ✕
          </button>
        </form>

        {keyword.trim() && (
          <div className="search-results">
            {loading ? (
              <div className="search-loading">Đang tìm kiếm...</div>
            ) : suggestions.length > 0 ? (
              <>
                <div className="search-suggestions">
                  {suggestions.map((product) => (
                    <div
                      key={product.id}
                      className="search-suggestion-item"
                      onClick={() => handleProductClick(product.id)}
                    >
                      <img
                        src={product.thumbnail}
                        alt={product.productName}
                        className="search-suggestion-img"
                      />
                      <div className="search-suggestion-info">
                        <h4>{product.productName}</h4>
                        <p className="search-suggestion-price">
                          {formatPrice(product.minPrice)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button 
                  className="search-view-all-btn"
                  onClick={handleSubmit}
                >
                  Xem tất cả kết quả cho "{keyword}"
                </button>
              </>
            ) : (
              <div className="search-no-results">
                Không tìm thấy sản phẩm nào với từ khóa "{keyword}"
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
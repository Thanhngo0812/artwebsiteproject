import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaTimes, FaCheck, FaBoxOpen, FaInfoCircle } from 'react-icons/fa';
import './ProductVariantSelector.scss';

const API_BASE_URL = 'http://localhost:8888';

export default function ProductVariantSelector({ isOpen, onClose, onSelect }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [variantsLoading, setVariantsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (isOpen && products.length === 0 && searchQuery.trim() === '') {
      loadSuggestedProducts();
    }
  }, [isOpen]);

  // ===== Load sản phẩm  =====
  const loadSuggestedProducts = async () => {
    try {
      setLoading(true);
      setIsSearching(false);
      const token = localStorage.getItem('user');
      
      const res = await axios.get(`${API_BASE_URL}/api/products/admin/list`, {
        params: { 
          page: 0, 
          size: 50
        },
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      setProducts(res.data?.content || []);
    } catch (err) {
      console.error('Load suggested products error:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };


  // ===== Search khi user gõ (debounce 300ms) =====
  useEffect(() => {
    if (searchQuery.trim().length < 2) {

      if (searchQuery.trim() === '' && isOpen) {
        loadSuggestedProducts();
      }
      return;
    }

    const delayDebounce = setTimeout(() => {
      searchProducts(searchQuery);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // ===== Fetch variants khi chọn product =====
  useEffect(() => {
    if (selectedProduct) {
      fetchVariants(selectedProduct.id);
    } else {
      setVariants([]);
    }
  }, [selectedProduct]);

  // ===== Search products  =====
  const searchProducts = async (query) => {
    try {
      setLoading(true);
      setIsSearching(true);
      const token = localStorage.getItem('user');
      
      // Khi search: Dùng search-query API với limit 50
      const res = await axios.get(`${API_BASE_URL}/api/products/search-query`, {
        params: { 
          q: query, 
          limit: 50
        },
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      setProducts(res.data || []);
    } catch (err) {
      console.error('Search error:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // ===== Fetch variants của 1 product =====
  const fetchVariants = async (productId) => {
    try {
      setVariantsLoading(true);
      const token = localStorage.getItem('user');
      

      const detailRes = await axios.get(
        `${API_BASE_URL}/api/products/${productId}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        }
      );
      
      const realVariants = detailRes.data?.variants || [];
      

      const enrichedVariants = realVariants.map((v) => ({
        variantId: v.id,
        productId: selectedProduct.id,
        productName: selectedProduct.productName,
        thumbnail: selectedProduct.thumbnail,
        dimensions: v.dimensions,
        price: v.price,
        stockQuantity: v.stockQuantity,
        costPrice: v.costPrice || null
      }));
      
      setVariants(enrichedVariants);
    } catch (err) {
      console.error('Fetch variants error:', err);
      setVariants([]);
    } finally {
      setVariantsLoading(false);
    }
  };

  // ===== Handle khi chọn variant =====
  const handleSelectVariant = (variant) => {
    onSelect({
      variantId: variant.variantId,
      productName: variant.productName,
      dimensions: variant.dimensions,
      price: variant.price,
      stockQuantity: variant.stockQuantity,
      thumbnail: variant.thumbnail,
      costPrice: variant.costPrice
    });
    handleClose();
  };

  // ===== Đóng modal và reset state =====
  const handleClose = () => {
    setSearchQuery('');
    setProducts([]);
    setSelectedProduct(null);
    setVariants([]);
    setIsSearching(false);
    onClose();
  };

  // ===== Format tiền VND =====
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(value || 0);
  };

  if (!isOpen) return null;

  return (
    <div className="product-selector-overlay" onClick={handleClose}>
      <div className="product-selector-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="selector-header">
          <h3>
            <FaBoxOpen /> Chọn Sản Phẩm
          </h3>
          <button className="btn-close-modal" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>

        {/* Search Bar */}
        <div className="selector-search">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm theo tên..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          {searchQuery.trim() && (
            <button 
              className="btn-clear-search"
              onClick={() => setSearchQuery('')}
            >
              <FaTimes />
            </button>
          )}
        </div>

        {/* Info banner */}
        {!isSearching && !searchQuery.trim() && (
          <div className="info-banner">
            <FaInfoCircle />
            <span>Đang hiển thị sản phẩm gợi ý. Bạn có thể tìm kiếm để xem thêm.</span>
          </div>
        )}

        {/* Content */}
        <div className="selector-content">
          {/* Products List */}
          {!selectedProduct && (
            <div className="products-section">
              <h4>
                {isSearching && searchQuery.trim() 
                  ? `🔍 Kết quả tìm kiếm "${searchQuery}" (${products.length})` 
                  : `⭐ Sản phẩm gợi ý (${products.length})`}
              </h4>
              
              {loading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Đang tải sản phẩm...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="empty-state">
                  <FaSearch size={48} />
                  <p>
                    {searchQuery.trim().length > 0
                      ? `Không tìm thấy sản phẩm nào với từ khóa "${searchQuery}"`
                      : 'Chưa có sản phẩm nào trong hệ thống'}
                  </p>
                </div>
              ) : (
                <div className="products-grid">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="product-card"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <div className="product-image">
                        <img
                          src={product.thumbnail || '/placeholder.png'}
                          alt={product.productName}
                          onError={(e) => {
                            e.target.src = '/placeholder.png';
                          }}
                        />
                      </div>
                      <div className="product-info">
                        <h5>{product.productName}</h5>
                        <p className="product-price">
                          {formatCurrency(product.originalPrice || product.minPrice)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Variants List */}
          {selectedProduct && (
            <div className="variants-section">
              <div className="variants-header">
                <button 
                  className="btn-back" 
                  onClick={() => setSelectedProduct(null)}
                >
                  ← Quay lại
                </button>
                <h4>Chọn kích thước - {selectedProduct.productName}</h4>
              </div>

              {variantsLoading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Đang tải kích thước sản phẩm...</p>
                </div>
              ) : variants.length === 0 ? (
                <div className="empty-state">
                  <FaBoxOpen size={48} />
                  <p>Sản phẩm này chưa có kích thước (variants)</p>
                </div>
              ) : (
                <div className="variants-list">
                  {variants.map((variant, idx) => (
                    <div
                      key={idx}
                      className="variant-item"
                      onClick={() => handleSelectVariant(variant)}
                    >
                      <div className="variant-main">
                        <div className="variant-dimension">
                          <FaBoxOpen />
                          <strong>{variant.dimensions}</strong>
                        </div>
                        <div className="variant-details">
                          <span className="variant-price">
                            {formatCurrency(variant.price)}
                          </span>
                          <span className={`variant-stock ${variant.stockQuantity < 5 ? 'low-stock' : ''}`}>
                            Tồn: {variant.stockQuantity}
                          </span>
                        </div>
                      </div>
                      <button className="btn-select-variant">
                        <FaCheck /> Chọn
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

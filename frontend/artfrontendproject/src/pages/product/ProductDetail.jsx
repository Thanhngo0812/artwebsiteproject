import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import productService from '../../service/productService';
import ProductCard from '../../components/ProductCard';
import { useCart } from '../../hooks/useCart';
import './css/ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const [parentCategories, setParentCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [displayCategories, setDisplayCategories] = useState([]); // ✅ THÊM: Categories hiển thị

  useEffect(() => {
    fetchProductDetail();
    window.scrollTo(0, 0);
    saveToViewedProducts(id);
  }, [id]);

  const saveToViewedProducts = (productId) => {
    try {
      const viewed = JSON.parse(localStorage.getItem('viewedProducts') || '[]');
      const newViewed = [Number(productId), ...viewed.filter(v => v !== Number(productId))].slice(0, 20);
      localStorage.setItem('viewedProducts', JSON.stringify(newViewed));
    } catch (error) {
      console.error('Error saving viewed products:', error);
    }
  };

  const fetchProductDetail = async () => {
    setLoading(true);
    try {
      const data = await productService.getProductById(id);
      setProduct(data);
      
      if (data.images && data.images.length > 0) {
        setMainImage(data.images[0].imageUrl);
      } else {
        setMainImage(data.thumbnail);
      }

      // ✅ LOGIC MỚI: Phân loại + xác định categories hiển thị
      if (data.categories && data.categories.length > 0) {
        const parents = data.categories.filter(c => c.id >= 1 && c.id <= 5);
        const children = data.categories.filter(c => c.id >= 6);
        
        setParentCategories(parents);
        setChildCategories(children);

        console.log('📁 Parent categories:', parents);
        console.log('📂 Child categories:', children);

        let categoriesToDisplay = [];
        let defaultCategory = null;

        // ✅ QUY TẮC HIỂN THỊ:
        if (parents.length >= 2) {
          // Trường hợp 1: Có 2 cha → Hiển thị 2 cha
          categoriesToDisplay = parents;
          defaultCategory = parents[0].id;
        } else if (parents.length === 1 && children.length > 0) {
          // Trường hợp 2: 1 cha + con → CHỈ HIỂN THỊ CON
          categoriesToDisplay = children;
          defaultCategory = children[0].id;
        } else if (children.length > 0) {
          // Trường hợp 3: Chỉ có con → Hiển thị con
          categoriesToDisplay = children;
          defaultCategory = children[0].id;
        } else if (parents.length === 1) {
          // Trường hợp 4: Chỉ có 1 cha
          categoriesToDisplay = parents;
          defaultCategory = parents[0].id;
        }

        setDisplayCategories(categoriesToDisplay);
        setSelectedCategory(defaultCategory);

        console.log('✅ Display categories:', categoriesToDisplay);
      }

      if (data.variants && data.variants.length > 0) {
        const firstAvailable = data.variants.find(v => v.stockQuantity > 0) || data.variants[0];
        setSelectedVariant(firstAvailable);
      }

      if (data.categories && data.categories.length > 0) {
        const categoryId = data.categories[0].id;
        const related = await productService.getRelatedByCategory(categoryId, 8);
        const filtered = related.filter(p => p.id !== parseInt(id));
        setRelatedProducts(filtered);
      }

    } catch (error) {
      console.error('❌ Error:', error);
      toast.error('Không thể tải thông tin sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  /**
   * ✅ FIX: getVariantsByCategory - Dựa vào displayCategories
   */
  const getVariantsByCategory = (categoryId) => {
    if (!product || !product.variants) return [];

    // ✅ Nếu có 2 cha
    if (parentCategories.length >= 2) {
      const parentIndex = parentCategories.findIndex(c => c.id === categoryId);
      if (parentIndex === -1) return [];
      
      const variantsPerParent = Math.ceil(product.variants.length / parentCategories.length);
      const startIndex = parentIndex * variantsPerParent;
      const endIndex = startIndex + variantsPerParent;
      
      return product.variants.slice(startIndex, endIndex);
    }
    
    // ✅ Nếu hiển thị con (1 cha + nhiều con)
    if (displayCategories.length > 0 && displayCategories[0].id >= 6) {
      const childIndex = displayCategories.findIndex(c => c.id === categoryId);
      if (childIndex === -1) return product.variants;
      
      const variantsPerChild = Math.ceil(product.variants.length / displayCategories.length);
      const startIndex = childIndex * variantsPerChild;
      const endIndex = startIndex + variantsPerChild;
      
      return product.variants.slice(startIndex, endIndex);
    }
    
    return product.variants;
  };

  const getCategoryName = () => {
    if (!product) return '';
    const cat = product.categories.find(c => c.id === selectedCategory);
    return cat ? cat.name : '';
  };

  const handleAddToCart = () => {
    if (!selectedVariant || selectedVariant.stockQuantity <= 0) {
      toast.warning('Sản phẩm này hiện đã hết hàng');
      return;
    }

    if (!product || !product.id) {
      toast.error('Lỗi: Không tìm thấy thông tin sản phẩm');
      return;
    }

    const categoryName = getCategoryName();

    addToCart(product, selectedCategory, categoryName, selectedVariant.dimensions, quantity);
    toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  const handleImageClick = (imageUrl, index) => {
    setMainImage(imageUrl);
    setActiveImageIndex(index);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="pd-loading-container">
        <div className="pd-loading-spinner"></div>
        <p>Đang tải sản phẩm...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pd-error">
        <h2>Không tìm thấy sản phẩm</h2>
        <Link to="/products" className="pd-back-link">← Quay lại danh sách sản phẩm</Link>
      </div>
    );
  }

  const inStock = selectedVariant && selectedVariant.stockQuantity > 0;
  const currentCategoryVariants = getVariantsByCategory(selectedCategory);

  return (
    <div className="product-detail-page">
      <div className="pd-breadcrumb">
        <Link to="/">Trang chủ</Link>
        <span> / </span>
        <Link to="/products">Sản phẩm</Link>
        <span> / </span>
        <span>{product.productName || product.productname}</span>
      </div>

      <div className="pd-container">
        <div className="pd-left">
          <div className="pd-main-image">
            <img src={mainImage} alt={product.productName || product.productname} />
          </div>
          
          {product.images && product.images.length > 1 && (
            <div className="pd-thumbnails">
              {product.images.map((img, idx) => (
                <img 
                  key={idx}
                  src={img.imageUrl} 
                  alt={`${product.productName}-${idx}`}
                  className={activeImageIndex === idx ? 'active' : ''}
                  onClick={() => handleImageClick(img.imageUrl, idx)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="pd-right">
          <h1 className="pd-title">{product.productName || product.productname}</h1>
          
          <div className="pd-price">
            {selectedVariant ? formatPrice(selectedVariant.price) : formatPrice(product.minPrice)}
          </div>

          {/* ✅ HIỂN THỊ CATEGORY: Buttons hoặc Dropdown */}
          {displayCategories.length > 1 && (
            <div className="pd-category-section">
              <label>Loại tranh:</label>
              
              {/* ✅ Nếu có 2 cha → Buttons */}
              {parentCategories.length >= 2 ? (
                <div className="pd-category-options">
                  {displayCategories.map((cat) => (
                    <button
                      key={cat.id}
                      className={`pd-category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        const variants = getVariantsByCategory(cat.id);
                        if (variants.length > 0) {
                          const firstAvailable = variants.find(v => v.stockQuantity > 0) || variants[0];
                          setSelectedVariant(firstAvailable);
                        }
                      }}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              ) : (
                /* ✅ Nhiều con → Dropdown */
                <select 
                  value={selectedCategory}
                  onChange={(e) => {
                    const newCatId = parseInt(e.target.value);
                    setSelectedCategory(newCatId);
                    const variants = getVariantsByCategory(newCatId);
                    if (variants.length > 0) {
                      const firstAvailable = variants.find(v => v.stockQuantity > 0) || variants[0];
                      setSelectedVariant(firstAvailable);
                    }
                  }}
                  className="pd-category-dropdown"
                >
                  {displayCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Variant Selection */}
          {currentCategoryVariants.length > 0 && (
            <div className="pd-variant-section">
              <label>Chọn kích thước:</label>
              <div className="pd-variant-options">
                {currentCategoryVariants.map((variant) => (
                  <button
                    key={variant.id}
                    className={`pd-variant-btn ${selectedVariant?.id === variant.id ? 'active' : ''} ${variant.stockQuantity <= 0 ? 'out-of-stock' : ''}`}
                    onClick={() => setSelectedVariant(variant)}
                    disabled={variant.stockQuantity <= 0}
                  >
                    <span className="variant-size">{variant.dimensions}</span>
                    <span className="variant-price">{formatPrice(variant.price)}</span>
                    {variant.stockQuantity <= 0 && <span className="variant-soldout">Hết hàng</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="pd-quantity-section">
            <label>Số lượng:</label>
            <div className="pd-quantity-control">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={!inStock}
              >
                −
              </button>
              <input 
                type="number" 
                value={quantity} 
                onChange={(e) => setQuantity(Math.max(1, Math.min(selectedVariant?.stockQuantity || 1, parseInt(e.target.value) || 1)))}
                min="1"
                max={selectedVariant?.stockQuantity || 1}
                disabled={!inStock}
              />
              <button 
                onClick={() => setQuantity(Math.min(selectedVariant?.stockQuantity || 1, quantity + 1))}
                disabled={!inStock}
              >
                +
              </button>
            </div>
            {selectedVariant && (
              <span className="pd-stock-info">
                {selectedVariant.stockQuantity > 0 
                  ? `Còn ${selectedVariant.stockQuantity} sản phẩm` 
                  : 'Hết hàng'}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="pd-actions">
            <button 
              className={`pd-btn-add ${!inStock ? 'disabled' : ''}`}
              onClick={handleAddToCart}
              disabled={!inStock}
            >
              {inStock ? 'Thêm vào giỏ' : 'Hết hàng'}
            </button>
            
            <button 
              className="pd-btn-buy"
              onClick={handleBuyNow}
              disabled={!inStock}
            >
              Mua ngay
            </button>
          </div>

          <div className="pd-info-section">
            <div className="pd-info-item">
              <span className="pd-info-label">Danh mục:</span>
            <span className="pd-info-value">
              {displayCategories.length > 0 
                ? displayCategories.map(c => c.name).join(', ')
                : (product.categories?.map(c => c.name).join(', ') || '—')}
            </span>
            </div>
            
            {product.colors && product.colors.length > 0 && (
              <div className="pd-info-item">
                <span className="pd-info-label">Màu sắc:</span>
                <div className="pd-colors">
                  {product.colors.map((color, idx) => (
                    <span 
                      key={idx}
                      className="pd-color-box"
                      style={{ backgroundColor: color.hexCode }}
                      title={color.hexCode}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="pd-info-item pd-description">
              <span className="pd-info-label">Mô tả:</span>
              <p className="pd-info-value">{product.description}</p>
            </div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="pd-related-section">
          <h2 className="pd-related-title">Sản phẩm liên quan</h2>
          <div className="pd-related-grid">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
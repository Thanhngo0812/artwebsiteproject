import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ProductCard from '../../components/ProductCard';
import './css/ProductDetail.css';

const API_BASE = 'http://localhost:8888/api';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState('');

  useEffect(() => {
    fetchProductDetail();
    // Scroll to top when product changes
    window.scrollTo(0, 0);
  }, [id]);

  const fetchProductDetail = async () => {
    setLoading(true);
    try {
      // Fetch product detail
      const response = await fetch(`${API_BASE}/products/${id}`);
      if (!response.ok) throw new Error('Product not found');
      
      const data = await response.json();
      setProduct(data);
      setMainImage(data.thumbnail);

      // Set default variant (first one with stock)
      if (data.variants && data.variants.length > 0) {
        const firstAvailable = data.variants.find(v => v.stockQuantity > 0) || data.variants[0];
        setSelectedVariant(firstAvailable);
      }

      // Fetch related products (same category, in stock)
      if (data.categories && data.categories.length > 0) {
        const categoryId = data.categories[0].id;
        const relatedResponse = await fetch(`${API_BASE}/products?categoryId=${categoryId}&size=9`);
        const relatedData = await relatedResponse.json();
        
        // Filter out current product and out of stock
        const filtered = (relatedData.content || relatedData).filter(p => 
          p.id !== parseInt(id) && 
          p.variants?.some(v => v.stockQuantity > 0)
        ).slice(0, 8);
        
        setRelatedProducts(filtered);
      }

    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Không thể tải thông tin sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!selectedVariant || selectedVariant.stockQuantity <= 0) {
      toast.warning('Sản phẩm này hiện đã hết hàng');
      return;
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartItem = {
      productId: product.id,
      productName: product.productname,
      thumbnail: product.thumbnail,
      variant: selectedVariant.dimensions,
      price: selectedVariant.price,
      quantity: quantity,
      maxStock: selectedVariant.stockQuantity
    };

    // Check if item already exists in cart
    const existingIndex = cart.findIndex(
      item => item.productId === cartItem.productId && item.variant === cartItem.variant
    );

    if (existingIndex >= 0) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success('Đã thêm vào giỏ hàng!');
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (loading) {
    return <div className="pd-loading">Đang tải...</div>;
  }

  if (!product) {
    return <div className="pd-error">Không tìm thấy sản phẩm</div>;
  }

  const inStock = selectedVariant && selectedVariant.stockQuantity > 0;
  const colorsText = product.colors?.map(c => c.hexCode).join(' - ') || '—';
  const variantsText = product.variants?.map(v => v.dimensions).join(' / ') || '—';

  return (
    <div className="product-detail-page">
      {/* Top Section: Image + Info */}
      <div className="pd-container">
        {/* Left: Images */}
        <div className="pd-left">
          <div className="pd-main-image">
            <img src={mainImage} alt={product.productname} />
          </div>
          
          {product.images && product.images.length > 0 && (
            <div className="pd-thumbnails">
              <img 
                src={product.thumbnail} 
                alt="Main" 
                className={mainImage === product.thumbnail ? 'active' : ''}
                onClick={() => setMainImage(product.thumbnail)}
              />
              {product.images.map((img, idx) => (
                <img 
                  key={idx}
                  src={img.imageUrl} 
                  alt={`${product.productname}-${idx}`}
                  className={mainImage === img.imageUrl ? 'active' : ''}
                  onClick={() => setMainImage(img.imageUrl)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info */}
        <div className="pd-right">
          <h1 className="pd-title">{product.productname}</h1>
          
          <div className="pd-price">
            {selectedVariant ? formatPrice(selectedVariant.price) : formatPrice(product.minPrice)}
          </div>

          {/* Variant Selection */}
          {product.variants && product.variants.length > 0 && (
            <div className="pd-variant-section">
              <label>Chọn loại:</label>
              <div className="pd-variant-options">
                {product.variants.map((variant) => (
                  <button
                    key={variant.dimensions}
                    className={`pd-variant-btn ${selectedVariant?.dimensions === variant.dimensions ? 'active' : ''} ${variant.stockQuantity <= 0 ? 'out-of-stock' : ''}`}
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
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
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

          {/* Action Buttons */}
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
              Thanh toán
            </button>
          </div>

          {/* Product Info */}
          <div className="pd-info-section">
            <div className="pd-info-item">
              <span className="pd-info-label">Tên tác phẩm:</span>
              <span className="pd-info-value">{product.productname}</span>
            </div>
            
            <div className="pd-info-item">
              <span className="pd-info-label">Thể loại:</span>
              <span className="pd-info-value">
                {product.categories?.map(c => c.name).join(', ') || '—'}
              </span>
            </div>
            
            <div className="pd-info-item">
              <span className="pd-info-label">Màu sắc:</span>
              <span className="pd-info-value">
                {product.colors && product.colors.length > 0 ? (
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
                ) : '—'}
              </span>
            </div>
            
            <div className="pd-info-item">
              <span className="pd-info-label">Loại:</span>
              <span className="pd-info-value">{variantsText}</span>
            </div>

            <div className="pd-info-item pd-description">
              <span className="pd-info-label">Mô tả:</span>
              <p className="pd-info-value">{product.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="pd-related-section">
          <h2 className="pd-related-title">Có thể bạn quan tâm</h2>
          <div className="pd-related-grid">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          
          {relatedProducts.length >= 8 && product.categories?.[0] && (
            <div className="pd-related-more">
              <Link 
                to={`/products?categoryId=${product.categories[0].id}`}
                className="pd-view-more-btn"
              >
                Xem thêm →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
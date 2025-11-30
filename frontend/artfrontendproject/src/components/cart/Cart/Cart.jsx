
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../../hooks/useCart';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-toastify';
import './Cart.css';

export default function Cart() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const {
    cartItems,
    updateQuantity,
    updateSize,
    removeItem,
    getTotal
  } = useCart();

  const [availableVariants, setAvailableVariants] = useState({});
  const [productStatuses, setProductStatuses] = useState({});
  const [productPromotions, setProductPromotions] = useState({});
  const [loading, setLoading] = useState(false);
  const [editingQuantity, setEditingQuantity] = useState({});

  useEffect(() => {
    cartItems.forEach(item => {
      fetchProductData(item.productId);
    });
  }, [cartItems]);


  const fetchProductData = async (productId) => {
    try {
      setLoading(true);
      const response = await fetch(`https://deployforstudy-1.onrender.com/api/products/${productId}`);

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();

      const variants = data.variants || [];

      setAvailableVariants(prev => ({
        ...prev,
        [productId]: variants
      }));

      setProductStatuses(prev => ({
        ...prev,
        [productId]: data.productStatus
      }));


      setProductPromotions(prev => ({
        ...prev,
        [productId]: {
          minPrice: data.minPrice,
          promotionalPrice: data.promotionalPrice
        }
      }));

    } catch (error) {
      console.error('❌ Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateVariantPromotion = (variant) => {
    // const promo = productPromotions[productId];
    // if (!promo || !promo.promotionalPrice || !promo.minPrice) {
    //   return { price: variantPrice, originalPrice: variantPrice, promotionalPrice: null };
    // }

    // const discountPercent = (promo.minPrice - promo.promotionalPrice) / promo.minPrice;
    // const discount = variantPrice * discountPercent;
    // const promoPrice = variantPrice - discount;

    return {
      price: variant.promotionalPrice?variant.promotionalPrice:variant.price,
      originalPrice: variant.price,
      promotionalPrice: variant.promotionalPrice
    };
  };

  const handleDimensionChange = (index, newVariantId) => {
    const productId = cartItems[index].productId;
    const variants = availableVariants[productId];

    if (!variants) return;

    const selectedVariant = variants.find(v => v.id === parseInt(newVariantId));

    if (selectedVariant) {
      const currentQuantity = cartItems[index].quantity;

      const priceData = calculateVariantPromotion(selectedVariant);

      if (currentQuantity > selectedVariant.stockQuantity) {
        updateSize(
          index,
          cartItems[index].categoryId,
          cartItems[index].categoryName,
          selectedVariant.dimensions,
          priceData.price,
          priceData.originalPrice,
          priceData.promotionalPrice
        );

        const quantityDelta = selectedVariant.stockQuantity - currentQuantity;
        updateQuantity(index, quantityDelta);
      } else {
        updateSize(
          index,
          cartItems[index].categoryId,
          cartItems[index].categoryName,
          selectedVariant.dimensions,
          priceData.price,
          priceData.originalPrice,
          priceData.promotionalPrice
        );
      }
    }
  };

  const handleQuantityInputChange = (index, value) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setEditingQuantity(prev => ({ ...prev, [index]: numericValue }));
  };

  const handleQuantityInputBlur = (index) => {
    const inputValue = editingQuantity[index];

    if (!inputValue || inputValue === '') {
      setEditingQuantity(prev => {
        const newState = { ...prev };
        delete newState[index];
        return newState;
      });
      return;
    }

    let newQuantity = parseInt(inputValue, 10);

    if (isNaN(newQuantity) || newQuantity < 1) {
      newQuantity = 1;
    }

    const item = cartItems[index];
    const variants = availableVariants[item.productId];

    if (variants) {
      const currentVariant = variants.find(v => v.dimensions === item.dimensions);

      if (currentVariant && newQuantity > currentVariant.stockQuantity) {
        alert(`Chỉ còn ${currentVariant.stockQuantity} sản phẩm!`);
        newQuantity = currentVariant.stockQuantity;
      }
    }

    const delta = newQuantity - item.quantity;
    if (delta !== 0) {
      updateQuantity(index, delta);
    }

    setEditingQuantity(prev => {
      const newState = { ...prev };
      delete newState[index];
      return newState;
    });
  };

  const handleQuantityKeyPress = (e, index) => {
    if (e.key === 'Enter') e.target.blur();
  };

  const handleQuantityButton = (index, delta) => {
    const item = cartItems[index];
    const newQuantity = item.quantity + delta;

    if (newQuantity < 1) return;

    const variants = availableVariants[item.productId];
    if (variants) {
      const currentVariant = variants.find(v => v.dimensions === item.dimensions);

      if (currentVariant && newQuantity > currentVariant.stockQuantity) return;
    }

    updateQuantity(index, delta);
  };

  const validCartItems = cartItems.filter(item =>
    productStatuses[item.productId] === 1
  );

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };


  const calculateDiscount = (original, promo) => {
    if (!promo || !original || promo >= original) return 0;
    return Math.round((1 - promo / original) * 100);
  };

  if (validCartItems.length === 0) {
    return (
      <div className="cart-empty">
        <div className="empty-cart-icon">🛒</div>
        <h2>Giỏ hàng trống</h2>
        <p>Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
        <button className="browse-btn">
          <Link to="/products">Khám phá sản phẩm</Link>
        </button>
      </div>
    );
  }

  const total = getTotal();

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2>Giỏ Hàng Của Tôi ({cartItems.length})</h2>
        <Link to="/products" className="continue-shopping">
          ← Tiếp tục mua sắm
        </Link>
      </div>

      <div className="cart-content">
        <div className="cart-labels">
          <span className="label-product">SẢN PHẨM</span>
          <span className="label-controls">CHI TIẾT</span>
          <span className="label-total">THÀNH TIỀN</span>
        </div>

        {validCartItems.map((item, index) => {
          const originalIndex = cartItems.findIndex(
            ci => ci.productId === item.productId &&
              ci.categoryId === item.categoryId &&
              ci.dimensions === item.dimensions
          );
          const variants = availableVariants[item.productId] || [];
          const currentVariant = variants.find(v => v.dimensions === item.dimensions);
          const maxStock = currentVariant ? currentVariant.stockQuantity : 999;

          const hasPromotion = item.promotionalPrice && item.promotionalPrice < item.originalPrice;
          const discountPercent = hasPromotion ? calculateDiscount(item.originalPrice, item.promotionalPrice) : 0;

          return (
            <div key={`${item.productId}-${item.categoryId}-${item.dimensions}-${index}`} className="cart-item">
              <div
                className="item-info"
                onClick={() => handleProductClick(item.productId)}
                style={{ cursor: 'pointer' }}
              >
                <img src={item.thumbnail} alt={item.productname} />
                <div className="item-details">
                  <h3>{item.productname}</h3>

                  {hasPromotion ? (
                    <div className="item-price-container">
                      <p className="item-price item-price-promo">
                        {formatPrice(item.promotionalPrice)}
                        <span className="item-discount-badge">-{discountPercent}%</span>
                      </p>
                      <p className="item-price-original">
                        {formatPrice(item.originalPrice)}
                      </p>
                    </div>
                  ) : (
                    <p className="item-price">{formatPrice(item.price)}</p>
                  )}
                </div>
              </div>

              <div className="item-controls">
                <div className="controls-row">
                  <div className="size-selector">
                    <label>Size:</label>
                    <select
                      value={currentVariant ? currentVariant.id : ''}
                      onChange={(e) => handleDimensionChange(originalIndex, e.target.value)}
                      className="size-dropdown"
                      disabled={loading || variants.length === 0}
                    >
                      {variants.map(variant => (
                        <option
                          key={variant.id}
                          value={variant.id}
                          disabled={variant.stockQuantity === 0}
                        >
                          {variant.dimensions} {variant.stockQuantity === 0 ? '(Hết hàng)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="quantity-selector">
                    <label>Số lượng:</label>
                    <div className="quantity-controls">
                      <button
                        onClick={() => handleQuantityButton(originalIndex, -1)}
                        disabled={item.quantity <= 1}
                        className="qty-btn"
                      >
                        −
                      </button>

                      <input
                        type="text"
                        inputMode="numeric"
                        className="quantity-input"
                        value={editingQuantity[originalIndex] !== undefined ? editingQuantity[originalIndex] : item.quantity}
                        onChange={(e) => handleQuantityInputChange(originalIndex, e.target.value)}
                        onBlur={() => handleQuantityInputBlur(originalIndex)}
                        onKeyPress={(e) => handleQuantityKeyPress(e, originalIndex)}
                      />

                      <button
                        onClick={() => handleQuantityButton(originalIndex, 1)}
                        disabled={item.quantity >= maxStock}
                        className="qty-btn"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {currentVariant && (
                  <span className="stock-info">
                    {currentVariant.stockQuantity < 10
                      ? `Chỉ còn ${currentVariant.stockQuantity}`
                      : `Còn ${currentVariant.stockQuantity}`}
                  </span>
                )}

                <button
                  className="remove-btn"
                  onClick={() => removeItem(originalIndex)}
                >
                  🗑️
                </button>
              </div>

              <div className="item-total">
                {formatPrice(item.price * item.quantity)}
              </div>
            </div>
          );
        })}
      </div>

      <div className="cart-footer">
        <div className="shipping-info">
          <span className="shipping-icon">🚚</span>
          <span>MIỄN PHÍ SHIP cho đơn hàng từ 800K. Hỗ trợ lắp đặt tại TPHCM và một số tỉnh lân cận.</span>
        </div>

        <div className="cart-summary">
          <div className="summary-row">
            <span>Tạm tính:</span>
            <span>{formatPrice(total)}</span>
          </div>
          <div className="summary-row shipping-fee">
            <span>Phí vận chuyển:</span>
            <span>{total >= 800000 ? 'Miễn phí' : formatPrice(30000)}</span>
          </div>
          <div className="summary-row total-row">
            <span>Tổng đơn hàng:</span>
            <span className="total-amount">
              {formatPrice(total >= 800000 ? total : total + 30000)}
            </span>
          </div>
        </div>

        <button
          className="checkout-btn"
          onClick={() => {
            if (!currentUser) {
              toast.error('Vui lòng đăng nhập để thanh toán!');
              navigate('/login');
              return;
            }
            navigate('/checkout');
          }}
        >
          Tiến hành đặt hàng
        </button>
      </div>
    </div>
  );
}

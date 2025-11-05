import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import './css/Cart.css';

export default function Cart() {
  const { 
    cartItems, 
    updateQuantity, 
    updateSize, 
    removeItem, 
    getTotal 
  } = useCart();
  
  const [availableSizes, setAvailableSizes] = useState({});

  useEffect(() => {
    cartItems.forEach(item => {
      fetchAvailableSizes(item.productId);
    });
  }, [cartItems]);

  const fetchAvailableSizes = async (productId) => {
    try {
      const response = await fetch(`http://localhost:8888/api/products/${productId}/variants`);
      const variants = await response.json();
      
      setAvailableSizes(prev => ({
        ...prev,
        [productId]: variants.map(v => ({
          dimensions: v.dimensions,
          price: v.price,
          stock: v.stockQuantity
        }))
      }));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSizeChange = (index, newDimensions) => {
    const sizeInfo = availableSizes[cartItems[index].productId]?.find(
      s => s.dimensions === newDimensions
    );
    if (sizeInfo) {
      updateSize(index, newDimensions, sizeInfo.price);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (cartItems.length === 0) {
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

        {cartItems.map((item, index) => (
          <div key={`${item.productId}-${item.dimensions}-${index}`} className="cart-item">
            <div className="item-info">
              <img src={item.thumbnail} alt={item.productname} />
              <div className="item-details">
                <h3>{item.productname}</h3>
                <p className="item-price">{formatPrice(item.price)}</p>
              </div>
            </div>

            <div className="item-controls">
              <div className="size-selector">
                <label>LOẠI:</label>
                <select 
                  value={item.dimensions}
                  onChange={(e) => handleSizeChange(index, e.target.value)}
                  className="size-dropdown"
                >
                  {availableSizes[item.productId]?.map(size => (
                    <option 
                      key={size.dimensions} 
                      value={size.dimensions}
                      disabled={size.stock === 0}
                    >
                      {size.dimensions} {size.stock === 0 ? '(Hết hàng)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="quantity-selector">
                <label>Số lượng:</label>
                <div className="quantity-controls">
                  <button 
                    onClick={() => updateQuantity(index, -1)}
                    disabled={item.quantity <= 1}
                    className="qty-btn"
                  >
                    −
                  </button>
                  <span className="quantity-value">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(index, 1)}
                    className="qty-btn"
                  >
                    +
                  </button>
                </div>
              </div>

              <button 
                className="remove-btn" 
                onClick={() => removeItem(index)}
                title="Xóa sản phẩm"
              >
                🗑️
              </button>
            </div>

            <div className="item-total">
              {formatPrice(item.price * item.quantity)}
            </div>
          </div>
        ))}
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
        
        <button className="checkout-btn">
          Tiến hành đặt hàng
        </button>
      </div>
    </div>
  );
}
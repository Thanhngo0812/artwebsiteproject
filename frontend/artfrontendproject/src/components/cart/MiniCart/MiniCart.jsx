import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MiniCart.css';

export default function MiniCart({ isOpen, onClose, cartItems, lastAddedItem }) {
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleViewCart = () => {
    onClose();
    navigate('/cart');
  };

  const handleCheckout = () => {
    onClose();
    navigate('/cart');
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="mini-cart-overlay" onClick={onClose}></div>

      <div className={`mini-cart-drawer ${isOpen ? 'open' : ''}`}>
        <div className="mini-cart-header">
          <div className="mini-cart-success">
            <span className="success-icon">✓</span>
            <span className="success-text">Sản phẩm đã được thêm vào giỏ</span>
          </div>
          <button className="mini-cart-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {lastAddedItem && (
          <div className="mini-cart-last-added">
            <img 
              src={lastAddedItem.thumbnail} 
              alt={lastAddedItem.productname} 
              className="last-added-image"
            />
            <div className="last-added-info">
              <h4>{lastAddedItem.productname}</h4>
              <p className="last-added-variant">
                Loại tranh: {lastAddedItem.categoryName}
              </p>
              <div className="last-added-price-row">
                <span className="last-added-price">{formatPrice(lastAddedItem.price)}</span>
                <span className="last-added-quantity">x{lastAddedItem.quantity}</span>
              </div>
            </div>
          </div>
        )}

        <div className="mini-cart-footer">
          <button 
            className="mini-cart-btn mini-cart-btn-view"
            onClick={handleViewCart}
          >
            Xem giỏ hàng ({cartItems.length})
          </button>
          <button 
            className="mini-cart-btn mini-cart-btn-checkout"
            onClick={handleCheckout}
          >
            Đặt hàng
          </button>
        </div>
      </div>
    </>
  );
}
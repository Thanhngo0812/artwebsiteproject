import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './css/Cart.css';

export default function Cart() {
  const [cartItems, setCartItems] = useState([
    {
      id: 'VU572.1',
      name: 'Bộ 10 Tranh Cô Gái Và Chú Chó',
      type: 'Tranh Canvas',
      price: 2580000,
      quantity: 1,
      image: '/product-image.jpg'
    },
    {
      id: 'VU572.1',
      name: 'Bộ 10 Tranh Cô Gái Và Chú Chó',
      type: 'Tranh Canvas',
      price: 2580000,
      quantity: 1,
      image: '/product-image.jpg'
    },
    {
      id: 'VU572.1',
      name: 'Bộ 10 Tranh Cô Gái Và Chú Chó',
      type: 'Tranh Canvas',
      price: 2580000,
      quantity: 1,
      image: '/product-image.jpg'
    }
  ]);

  const handleQuantityChange = (id, change) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id 
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Giỏ hàng trống</h2>
        <button className="browse-btn">
          <Link to="/products">Xem & lựa thêm</Link>
        </button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2>Giỏ Hàng Của Tôi</h2>
        <Link to="/products" className="continue-shopping">
          Xem & lựa thêm
        </Link>
      </div>

      <div className="cart-content">
        <div className="cart-labels">
          <span className="label-product">SẢN PHẨM</span>
          <span className="label-quantity">SỐ LƯỢNG</span>
          <span className="label-total">TỔNG</span>
        </div>

        {cartItems.map(item => (
          <div key={item.id} className="cart-item">
            <div className="item-info">
              <img src={item.image} alt={item.name} />
              <div className="item-details">
                <h3>{item.name}</h3>
                <p>Loại Tranh: {item.type}</p>
                {/* <p className="item-code">{item.id}</p> */}
              </div>
            </div>

            <div className="quantity-controls">
              <button onClick={() => handleQuantityChange(item.id, -1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => handleQuantityChange(item.id, 1)}>+</button>
              <button className="remove-btn" onClick={() => handleRemoveItem(item.id)}>
                🗑️
              </button>
            </div>

            <div className="item-total">
              {(item.price * item.quantity).toLocaleString()}đ
            </div>
          </div>
        ))}

        <div className="cart-footer">
          <div className="shipping-info">
            🚚 MIỄN PHÍ SHIP cho đơn hàng từ 800K. Hỗ trợ lắp đặt tại TPHCM và một số tỉnh lân cận.
          </div>
          <div className="cart-total">
            <span>Tổng đơn hàng:</span>
            <span className="total-amount">{total.toLocaleString()}đ</span>
          </div>
          <button className="checkout-btn">Đặt hàng</button>
        </div>
      </div>
    </div>
  );
}
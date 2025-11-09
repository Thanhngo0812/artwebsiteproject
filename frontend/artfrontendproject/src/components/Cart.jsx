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
  const [loading, setLoading] = useState(false);
  
  const [editingQuantity, setEditingQuantity] = useState({});

  useEffect(() => {
    cartItems.forEach(item => {
      fetchAvailableSizes(item.productId);
    });
  }, [cartItems]);

  const fetchAvailableSizes = async (productId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8888/api/products/${productId}/variants?page=0&size=20`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      let variants = [];
      
      if (Array.isArray(data)) {
        variants = data;
      } else if (data && Array.isArray(data.content)) {
        variants = data.content;
      } else {
        variants = [];
      }
      
      setAvailableSizes(prev => ({
        ...prev,
        [productId]: variants.map(v => ({
          dimensions: v.dimensions,
          price: v.price,
          stock: v.stockQuantity
        }))
      }));
      
    } catch (error) {
      setAvailableSizes(prev => ({
        ...prev,
        [productId]: []
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleSizeChange = (index, newDimensions) => {
    const productId = cartItems[index].productId;
    const sizes = availableSizes[productId];
    
    if (!sizes || !Array.isArray(sizes)) {
      console.warn('⚠️ No sizes available for product:', productId);
      return;
    }
    
    const sizeInfo = sizes.find(s => s.dimensions === newDimensions);
    
    if (sizeInfo) {
      updateSize(index, newDimensions, sizeInfo.price);
    }
  };

  const handleQuantityInputChange = (index, value) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    
    setEditingQuantity(prev => ({
      ...prev,
      [index]: numericValue
    }));
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
    const sizes = availableSizes[item.productId] || [];
    const currentSize = sizes.find(s => s.dimensions === item.dimensions);
    
    if (currentSize && newQuantity > currentSize.stock) {
      alert(`Chỉ còn ${currentSize.stock} sản phẩm trong kho!`);
      newQuantity = currentSize.stock;
    }
    
    // Tính delta để cập nhật
    const currentQuantity = item.quantity;
    const delta = newQuantity - currentQuantity;
    
    if (delta !== 0) {
      updateQuantity(index, delta);
    }
    
    // Clear editing state
    setEditingQuantity(prev => {
      const newState = { ...prev };
      delete newState[index];
      return newState;
    });
  };

  const handleQuantityKeyPress = (e, index) => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
  };

  const handleQuantityButton = (index, delta) => {
    const item = cartItems[index];
    const newQuantity = item.quantity + delta;
    
    // Validate min
    if (newQuantity < 1) return;
    
    // Validate stock
    const sizes = availableSizes[item.productId] || [];
    const currentSize = sizes.find(s => s.dimensions === item.dimensions);
    
    if (currentSize && newQuantity > currentSize.stock) {
      // alert(`Chỉ còn ${currentSize.stock} sản phẩm trong kho!`);
      return;
    }
    
    updateQuantity(index, delta);
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

        {cartItems.map((item, index) => {
          const sizes = availableSizes[item.productId] || [];
          // ✅ Lấy stock của size hiện tại
          const currentSize = sizes.find(s => s.dimensions === item.dimensions);
          const maxStock = currentSize ? currentSize.stock : 999;
          
          return (
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
                    disabled={loading || sizes.length === 0}
                  >
                    {sizes.length === 0 ? (
                      <option value="">Đang tải...</option>
                    ) : (
                      sizes.map(size => (
                        <option 
                          key={size.dimensions} 
                          value={size.dimensions}
                          disabled={size.stock === 0}
                        >
                          {size.dimensions} {size.stock === 0 ? '(Hết hàng)' : ''}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                {/* ✅ NEW: Quantity selector với input trực tiếp */}
                <div className="quantity-selector">
                  <label>Số lượng:</label>
                  <div className="quantity-controls">
                    <button 
                      onClick={() => handleQuantityButton(index, -1)}
                      disabled={item.quantity <= 1}
                      className="qty-btn"
                      title="Giảm số lượng"
                    >
                      −
                    </button>
                    
                    {/* ✅ NEW: Input có thể nhập trực tiếp */}
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      className="quantity-input"
                      value={editingQuantity[index] !== undefined ? editingQuantity[index] : item.quantity}
                      onChange={(e) => handleQuantityInputChange(index, e.target.value)}
                      onBlur={() => handleQuantityInputBlur(index)}
                      onKeyPress={(e) => handleQuantityKeyPress(e, index)}
                      style={{
                        width: '50px',
                        textAlign: 'center',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        padding: '4px',
                        fontSize: '14px'
                      }}
                    />
                    
                    <button 
                      onClick={() => handleQuantityButton(index, 1)}
                      disabled={item.quantity >= maxStock}
                      className="qty-btn"
                      title="Tăng số lượng"
                    >
                      +
                    </button>
                  </div>
                  
                  {currentSize && (
                    <span className="stock-info" style={{
                      fontSize: '12px',
                      color: currentSize.stock < 10 ? '#ff6b6b' : '#666',
                      marginTop: '4px'
                    }}>
                      {currentSize.stock < 10 ? `Chỉ còn ${currentSize.stock}` : `Còn ${currentSize.stock}`}
                    </span>
                  )}
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
        
        <button className="checkout-btn">
          Tiến hành đặt hàng
        </button>
      </div>
    </div>
  );
}
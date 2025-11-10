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
  
  const [availableVariants, setAvailableVariants] = useState({});
  const [loading, setLoading] = useState(false);
  const [editingQuantity, setEditingQuantity] = useState({});

  useEffect(() => {
    cartItems.forEach(item => {
      fetchAvailableVariants(item.productId);
    });
  }, [cartItems]);

  const fetchAvailableVariants = async (productId) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8888/api/products/${productId}`);
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      
      const categories = data.categories || [];
      const variants = data.variants || [];
      
      const parents = categories.filter(c => c.id >= 1 && c.id <= 5);
      const children = categories.filter(c => c.id >= 6);
      
      // ✅ XÁC ĐỊNH CATEGORIES HIỂN THỊ (như ProductDetail)
      let displayCategories = [];
      if (parents.length >= 2) {
        displayCategories = parents;
      } else if (parents.length === 1 && children.length > 0) {
        displayCategories = children; // ✅ CHỈ HIỂN THỊ CON
      } else if (children.length > 0) {
        displayCategories = children;
      } else if (parents.length === 1) {
        displayCategories = parents;
      }
      
      const enrichedVariants = [];
      
      if (parents.length >= 2) {
        parents.forEach((cat, catIndex) => {
          const variantsPerParent = Math.ceil(variants.length / parents.length);
          const startIndex = catIndex * variantsPerParent;
          const endIndex = startIndex + variantsPerParent;
          
          const parentVariants = variants.slice(startIndex, endIndex);
          
          parentVariants.forEach(variant => {
            enrichedVariants.push({
              id: variant.id,
              categoryId: cat.id,
              categoryName: cat.name,
              dimensions: variant.dimensions,
              price: variant.price,
              stock: variant.stockQuantity
            });
          });
        });
      } else if (displayCategories.length > 0 && displayCategories[0].id >= 6) {
        // ✅ Chia variants cho CON
        displayCategories.forEach((cat, catIndex) => {
          const variantsPerChild = Math.ceil(variants.length / displayCategories.length);
          const startIndex = catIndex * variantsPerChild;
          const endIndex = startIndex + variantsPerChild;
          
          const childVariants = variants.slice(startIndex, endIndex);
          
          childVariants.forEach(variant => {
            enrichedVariants.push({
              id: variant.id,
              categoryId: cat.id,
              categoryName: cat.name,
              dimensions: variant.dimensions,
              price: variant.price,
              stock: variant.stockQuantity
            });
          });
        });
      } else {
        const singleCat = displayCategories[0] || categories[0];
        variants.forEach(variant => {
          enrichedVariants.push({
            id: variant.id,
            categoryId: singleCat.id,
            categoryName: singleCat.name,
            dimensions: variant.dimensions,
            price: variant.price,
            stock: variant.stockQuantity
          });
        });
      }
      
      setAvailableVariants(prev => ({
        ...prev,
        [productId]: {
          variants: enrichedVariants,
          categories: displayCategories
        }
      }));
      
    } catch (error) {
      console.error('❌ Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (index, newCategoryId) => {
    const productId = cartItems[index].productId;
    const data = availableVariants[productId];
    
    if (!data) return;
    
    // Lấy variant đầu tiên của category này
    const firstVariant = data.variants.find(v => v.categoryId === parseInt(newCategoryId));
    
    if (firstVariant) {
      updateSize(
        index,
        firstVariant.categoryId,
        firstVariant.categoryName,
        firstVariant.dimensions,
        firstVariant.price
      );
    }
  };

  const handleDimensionChange = (index, newVariantId) => {
    const productId = cartItems[index].productId;
    const data = availableVariants[productId];
    
    if (!data) return;
    
    const selectedVariant = data.variants.find(v => v.id === parseInt(newVariantId));
    
    if (selectedVariant) {
      updateSize(
        index,
        selectedVariant.categoryId,
        selectedVariant.categoryName,
        selectedVariant.dimensions,
        selectedVariant.price
      );
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
    const data = availableVariants[item.productId];
    
    if (data) {
      const currentVariant = data.variants.find(v => 
        v.categoryId === item.categoryId && v.dimensions === item.dimensions
      );
      
      if (currentVariant && newQuantity > currentVariant.stock) {
        alert(`Chỉ còn ${currentVariant.stock} sản phẩm!`);
        newQuantity = currentVariant.stock;
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
    
    const data = availableVariants[item.productId];
    if (data) {
      const currentVariant = data.variants.find(v => 
        v.categoryId === item.categoryId && v.dimensions === item.dimensions
      );
      
      if (currentVariant && newQuantity > currentVariant.stock) return;
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
          const data = availableVariants[item.productId];
          const currentVariant = data?.variants.find(v => 
            v.categoryId === item.categoryId && v.dimensions === item.dimensions
          );
          const maxStock = currentVariant ? currentVariant.stock : 999;
          
          // ✅ Lấy categories của item này
          const itemCategories = data?.categories || [];
          const currentDimensionVariants = data?.variants.filter(v => v.categoryId === item.categoryId) || [];
          
          return (
            <div key={`${item.productId}-${item.categoryId}-${item.dimensions}-${index}`} className="cart-item">
              <div className="item-info">
                <img src={item.thumbnail} alt={item.productname} />
                <div className="item-details">
                  <h3>{item.productname}</h3>
                  
                  {itemCategories.length > 1 && (
                    <div className="item-category-selector">
                      <label>Loại:</label>
                      <select 
                        value={item.categoryId}
                        onChange={(e) => handleCategoryChange(index, e.target.value)}
                        className="category-dropdown"
                        disabled={loading || !data}
                      >
                        {itemCategories.map(cat => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  
                  <p className="item-price">{formatPrice(item.price)}</p>
                </div>
              </div>

              <div className="item-controls">
                {/* ✅ LAYOUT MỚI: Category + Size NGANG HÀNG */}
                <div className="controls-row">
                  {/* ✅ KÍCH THƯỚC */}
                  <div className="size-selector">
                    <label>Kích thước:</label>
                    <select 
                      value={currentVariant ? currentVariant.id : ''}
                      onChange={(e) => handleDimensionChange(index, e.target.value)}
                      className="size-dropdown"
                      disabled={loading || !data}
                    >
                      {currentDimensionVariants.map(variant => (
                        <option 
                          key={variant.id} 
                          value={variant.id}
                          disabled={variant.stock === 0}
                        >
                          {variant.dimensions} {variant.stock === 0 ? '(Hết hàng)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quantity */}
                  <div className="quantity-selector">
                    <label>Số lượng:</label>
                    <div className="quantity-controls">
                      <button 
                        onClick={() => handleQuantityButton(index, -1)}
                        disabled={item.quantity <= 1}
                        className="qty-btn"
                      >
                        −
                      </button>
                      
                      <input
                        type="text"
                        inputMode="numeric"
                        className="quantity-input"
                        value={editingQuantity[index] !== undefined ? editingQuantity[index] : item.quantity}
                        onChange={(e) => handleQuantityInputChange(index, e.target.value)}
                        onBlur={() => handleQuantityInputBlur(index)}
                        onKeyPress={(e) => handleQuantityKeyPress(e, index)}
                      />
                      
                      <button 
                        onClick={() => handleQuantityButton(index, 1)}
                        disabled={item.quantity >= maxStock}
                        className="qty-btn"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Stock info */}
                {currentVariant && (
                  <span className="stock-info">
                    {currentVariant.stock < 10 ? `Chỉ còn ${currentVariant.stock}` : `Còn ${currentVariant.stock}`}
                  </span>
                )}

                <button 
                  className="remove-btn" 
                  onClick={() => removeItem(index)}
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
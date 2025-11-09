import { useState, useEffect } from 'react';

export const useCart = () => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart khi hook được sử dụng
  useEffect(() => {
    loadCart();
  }, []);

  // Tự động lưu khi cart thay đổi
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } else {
      localStorage.removeItem('cart');
    }
  }, [cartItems]);

  const loadCart = () => {
    try {
      const saved = localStorage.getItem('cart');
      if (saved) {
        setCartItems(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const addToCart = (product, dimensions, quantity = 1) => {
    setCartItems(prevCart => {
      const existingIndex = prevCart.findIndex(
        item => item.productId === product.id && item.dimensions === dimensions
      );
      
      if (existingIndex !== -1) {
        const newCart = [...prevCart];
        newCart[existingIndex].quantity += quantity;
        return newCart;
      } else {
        return [...prevCart, {
          productId: product.id,
          productname: product.productname,
          thumbnail: product.thumbnail,
          dimensions: dimensions,
          price: product.variants?.find(v => v.dimensions === dimensions)?.price || 0,
          quantity: quantity
        }];
      }
    });
  };

  const updateQuantity = (index, change) => {
    setCartItems(prevCart => {
      const newCart = [...prevCart];
      const newQuantity = newCart[index].quantity + change;
      
      // Đảm bảo số lượng >= 1
      if (newQuantity >= 1) {
        newCart[index] = {
          ...newCart[index],
          quantity: newQuantity
        };
      }
      
      return newCart;
    });
  };

  const updateSize = (index, newDimensions, price) => {
    setCartItems(prevCart => {
      const newCart = [...prevCart];
      const productId = newCart[index].productId;
      
      // Cập nhật kích thước và giá
      newCart[index] = {
        ...newCart[index],
        dimensions: newDimensions,
        price: price
      };
      
      // Kiểm tra trùng lặp
      const duplicateIndex = newCart.findIndex((item, i) => 
        i !== index && 
        item.productId === productId && 
        item.dimensions === newDimensions
      );
      
      if (duplicateIndex !== -1) {
        // Gộp số lượng
        newCart[duplicateIndex] = {
          ...newCart[duplicateIndex],
          quantity: newCart[duplicateIndex].quantity + newCart[index].quantity
        };
        // Xóa item hiện tại
        newCart.splice(index, 1);
      }
      
      return newCart;
    });
  };

  const removeItem = (index) => {
    setCartItems(prevCart => prevCart.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const getTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getItemCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  return {
    cartItems,
    addToCart,
    updateQuantity,
    updateSize,
    removeItem,
    clearCart,
    getTotal,
    getItemCount
  };
};
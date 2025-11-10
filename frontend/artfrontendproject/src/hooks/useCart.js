import { useState, useEffect } from 'react';

export const useCart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    loadCart();
  }, []);

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

  /**
   * ✅ addToCart với categoryId, categoryName
   */
  const addToCart = (product, categoryId, categoryName, dimensions, quantity = 1) => {
    console.log('🛒 [addToCart] Input:', { product, categoryId, categoryName, dimensions, quantity });
    
    const productName = product.productName || product.productname || 'Sản phẩm không tên';
    const thumbnail = product.thumbnail || 
                     (product.images && product.images.length > 0 ? product.images[0].imageUrl : '') ||
                     '/placeholder.jpg';
    
    // ✅ Tìm giá từ variant
    let price = 0;
    if (product.variants && Array.isArray(product.variants)) {
      const variant = product.variants.find(v => v.dimensions === dimensions);
      price = variant ? variant.price : 0;
    }
    
    setCartItems(prevCart => {
      // ✅ Check trùng lặp: productId + categoryId + dimensions
      const existingIndex = prevCart.findIndex(
        item => item.productId === product.id && 
                item.categoryId === categoryId && 
                item.dimensions === dimensions
      );
      
      if (existingIndex !== -1) {
        const newCart = [...prevCart];
        newCart[existingIndex].quantity += quantity;
        return newCart;
      } else {
        const newItem = {
          productId: product.id,
          productname: productName,
          thumbnail: thumbnail,
          categoryId: categoryId,
          categoryName: categoryName,
          dimensions: dimensions,
          price: price,
          quantity: quantity
        };
        return [...prevCart, newItem];
      }
    });
  };

  const updateQuantity = (index, change) => {
    setCartItems(prevCart => {
      const newCart = [...prevCart];
      const newQuantity = newCart[index].quantity + change;
      
      if (newQuantity >= 1) {
        newCart[index] = {
          ...newCart[index],
          quantity: newQuantity
        };
      }
      
      return newCart;
    });
  };

  /**
   * ✅ updateSize với categoryId + categoryName
   */
  const updateSize = (index, newCategoryId, newCategoryName, newDimensions, price) => {
    setCartItems(prevCart => {
      const newCart = [...prevCart];
      const productId = newCart[index].productId;
      
      newCart[index] = {
        ...newCart[index],
        categoryId: newCategoryId,
        categoryName: newCategoryName,
        dimensions: newDimensions,
        price: price
      };
      
      const duplicateIndex = newCart.findIndex((item, i) => 
        i !== index && 
        item.productId === productId && 
        item.categoryId === newCategoryId &&
        item.dimensions === newDimensions
      );
      
      if (duplicateIndex !== -1) {
        newCart[duplicateIndex].quantity += newCart[index].quantity;
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
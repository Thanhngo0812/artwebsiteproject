import React from "react";
import { Link } from "react-router-dom";
import "./css/ProductCard.css";

export default function ProductCard({ product }) {
  const formatPrice = (price) => {
    if (!price || isNaN(price)) return "Liên hệ";
    
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };


  const originalPrice = product.originalPrice;
  const promoPrice = product.promotionalPrice;


  const isOutOfStock = product.stockQuantity === 0;

  const hasPromotion = promoPrice && originalPrice && promoPrice < originalPrice;

  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <div className="product-card-image">
        <img 
          src={product.thumbnail} 
          alt={product.productName || product.productname} 
        />
        
        {/* Badge khuyến mãi */}
        {hasPromotion && !isOutOfStock && (
          <div className="promo-badge">
            SALE {Math.round((1 - promoPrice / originalPrice) * 100)}%
          </div>
        )}

        {/* Badge hết hàng */}
        {isOutOfStock && (
          <div className="out-of-stock-badge">
            HẾT HÀNG
          </div>
        )}
      </div>
      
      <div className="product-card-info">
        <h3 className="product-card-name">
          {product.productName || product.productname}
        </h3>
        
        {/* Hiển thị giá */}
        <div className="product-card-pricing">
          {isOutOfStock ? (
            <p className="product-card-price out-of-stock-price">
              Liên hệ
            </p>
          ) : hasPromotion ? (
            <>
              <p className="product-card-price promo-price">
                {formatPrice(promoPrice)}
              </p>
              <p className="product-card-price original-price">
                {formatPrice(originalPrice)}
              </p>
            </>
          ) : (
            <p className="product-card-price">
              {formatPrice(originalPrice)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
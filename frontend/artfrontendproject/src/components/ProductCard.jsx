import React from "react";
import { Link } from "react-router-dom";
import "./css/ProductCard.css";

export default function ProductCard({ product }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <div className="product-card-image">
        <img src={product.thumbnail} alt={product.productname} />
      </div>
      <div className="product-card-info">
        <h3 className="product-card-name">{product.productname}</h3>
        <p className="product-card-price">{formatPrice(product.minPrice)}</p>
      </div>
    </Link>
  );
}
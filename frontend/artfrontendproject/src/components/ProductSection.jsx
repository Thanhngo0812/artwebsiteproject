import React from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import "./css/ProductSection.css";

export default function ProductSection({ 
  title, 
  products, 
  viewAllLink, 
  scrollable = false 
}) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="product-section">
      <div className="product-section-header">
        <h2 className="product-section-title">{title}</h2>
        {viewAllLink && !scrollable && (
          <Link to={viewAllLink} className="product-section-view-all">
            Xem tất cả →
          </Link>
        )}
      </div>
      
      <div className={`product-section-grid ${scrollable ? 'scrollable' : ''}`}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {!scrollable && viewAllLink && (
        <div className="product-section-footer">
          <Link to={viewAllLink} className="product-section-btn">
            Xem thêm
          </Link>
        </div>
      )}
    </section>
  );
}
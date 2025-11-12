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
  return (
    <section className={`product-section ${scrollable ? "scrollable" : ""}`}>
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        {viewAllLink && (
          <Link to={viewAllLink} className="view-all-link">
            Xem thêm →
          </Link>
        )}
      </div>

      <div className={`product-grid ${scrollable ? "scroll" : ""}`}>
        {products && products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="no-products">Không có sản phẩm nào</p>
        )}
      </div>
    </section>
  );
}
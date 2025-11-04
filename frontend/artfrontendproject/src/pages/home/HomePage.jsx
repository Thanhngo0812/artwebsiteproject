import React from "react";
import "./css/HomePage.css";

export default function HomePage() {
  //localStorage.setItem('user', 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJST0xFX1VTRVIiXSwic3ViIjoibmdvY29uZ3RoYW5oc2cwODEyIiwiaWF0IjoxNzYxOTg5MzgwLCJleHAiOjE3NjIwMTkzODB9.afj1NTGiTzjppFH9jsVr1iDOy04ZLDe4RBsv9r_j7EI');

  return (
  

    <div className="homepage-hero">
      <div className="homepage-overlay">
        <div className="homepage-center">
          <h1 className="homepage-title" style={{color:'#FBD865'}}>"Tranh Xịn"</h1>
          <h1 className="homepage-title">Thương Hiệu Tranh Trang Trí Hàng Đầu VN</h1>
          <div className="homepage-subtitle">TRANH ĐẸP TREO TƯỜNG TRANH XỊN</div>
          <button className="homepage-btn">Xem 20.000+ Bộ Tranh</button>
        </div>
      </div>
    </div>
  );
}

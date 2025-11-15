import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProductSection from "../../components/ProductSection";
import "./css/HomePage.css";

export default function HomePage() {
  //localStorage.setItem('user', 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJST0xFX1VTRVIiXSwic3ViIjoibmdvY29uZ3RoYW5oc2cwODEyIiwiaWF0IjoxNzYxOTg5MzgwLCJleHAiOjE3NjIwMTkzODB9.afj1NTGiTzjppFH9jsVr1iDOy04ZLDe4RBsv9r_j7EI');
  
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newestProducts, setNewestProducts] = useState([]);
  // const [viewedProducts, setViewedProducts] = useState([]);
  const [onSaleProducts, setOnSaleProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    // loadViewedProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Fetch sản phẩm khuyến mãi
      const onSaleRes = await axios.get(
        "http://localhost:8888/api/products/on-sale?page=0&size=8"
      );
      setOnSaleProducts(onSaleRes.data.content || []);

      // Fetch sản phẩm nổi bật
      const featuredRes = await axios.get(
        "http://localhost:8888/api/products/featured?page=0&size=8"
      );
      setFeaturedProducts(featuredRes.data.content || []);

      // Fetch sản phẩm mới
      const newestRes = await axios.get(
        "http://localhost:8888/api/products/newest?page=0&size=8"
      );
      setNewestProducts(newestRes.data.content || []);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  // Load sản phẩm đã xem từ localStorage
  // const loadViewedProducts = async () => {
  //   const viewed = localStorage.getItem("viewedProducts");
  //   if (viewed) {
  //     try {
  //       const productIds = JSON.parse(viewed);
  //       if (productIds && productIds.length > 0) {
  //         // Lấy tối đa 8 sản phẩm
  //         const idsToFetch = productIds.slice(0, 8);
  //         const response = await axios.post(
  //           "http://localhost:8888/api/products/by-ids?page=0&size=8",
  //           idsToFetch
  //         );
  //         setViewedProducts(response.data.content || []);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching viewed products:", error);
  //     }
  //   }
  // };

  const handleViewAllProducts = () => {
    navigate("/products");
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải sản phẩm...</p>
      </div>
    );
  }

  return (
    <div className="homepage">
      {/* Hero Section */}
      <div className="homepage-hero">
        <div className="homepage-overlay">
          <div className="homepage-center">
            <h1 className="homepage-title" style={{ color: "#FBD865" }}>
              "Tranh Xịn"
            </h1>
            <h1 className="homepage-title">
              Thương Hiệu Tranh Trang Trí Hàng Đầu VN
            </h1>
            <div className="homepage-subtitle">TRANH ĐẸP TREO TƯỜNG TRANH XỊN</div>
            <button className="homepage-btn" onClick={handleViewAllProducts}>
              Xem 20.000+ Bộ Tranh
            </button>
          </div>
        </div>
      </div>


      <ProductSection
        title="Sản Phẩm Khuyến Mãi"
        products={onSaleProducts}
        viewAllLink="/products/search?sort=on-sale"
      />

      <ProductSection
        title="Sản Phẩm Nổi Bật"
        products={featuredProducts}
        viewAllLink="/products/search?sort=featured"
      />

      <ProductSection
        title="Sản Phẩm Mới"
        products={newestProducts}
        viewAllLink="/products/search?sort=newest"
      />

    </div>
  );
}
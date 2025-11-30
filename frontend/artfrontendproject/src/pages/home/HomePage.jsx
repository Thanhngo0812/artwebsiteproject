import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProductSection from "../../components/product/ProductSection/ProductSection";
import "./css/HomePage.css";

// --- STYLE INJECTOR (Cho CSS Slider) ---
const StyleInjector = ({ styles }) => {
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
    return () => document.head.removeChild(styleElement);
  }, [styles]);
  return null;
};

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newestProducts, setNewestProducts] = useState([]);
  const [onSaleProducts, setOnSaleProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // --- SLIDER LOGIC ---
  const [activeSlide, setActiveSlide] = useState(0);
  const slides = [
    {
      image: "/bigbackground.jpg",
      title: "Tranh Xịn - Đẳng Cấp Không Gian",
      subtitle: "Nghệ thuật thổi hồn vào từng góc nhỏ ngôi nhà bạn"
    },
    {
      image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2071&auto=format&fit=crop",
      title: "Đẳng cấp không gian",
      subtitle: "Nghệ thuật thổi hồn vào từng góc nhỏ ngôi nhà bạn"
    },
    {
      image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=2070&auto=format&fit=crop",
      title: "Sáng Tạo Không Giới Hạn",
      subtitle: "Hơn 20.000+ mẫu tranh độc bản đang chờ bạn khám phá"
    }
  ];

  // Auto-play Slider
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // 5 giây chuyển 1 lần
    return () => clearInterval(timer);
  }, [slides.length]);
  // --------------------

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      const onSaleRes = await axios.get("http://localhost:8888/api/products/on-sale?page=0&size=8");
      setOnSaleProducts(onSaleRes.data.content || []);

      const featuredRes = await axios.get("http://localhost:8888/api/products/featured?page=0&size=8");
      setFeaturedProducts(featuredRes.data.content || []);

      const newestRes = await axios.get("http://localhost:8888/api/products/newest?page=0&size=8");
      setNewestProducts(newestRes.data.content || []);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  const handleViewAllProducts = () => {
    navigate("/products");
  };

  // --- CSS CHO SLIDER ---
  const sliderStyles = `
    /* Xóa style cũ của .homepage-hero nếu có xung đột */
    
    .hero-slider-container {
      position: relative;
      height: 600px; /* Chiều cao slider */
      width: 100%;
      overflow: hidden;
      margin-bottom: 40px;
    }

    .hero-slide {
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      background-size: cover;
      background-position: center;
      opacity: 0;
      transition: opacity 1s ease-in-out; /* Hiệu ứng Fade */
      z-index: 1;
    }
    
    .hero-slide.active {
      opacity: 1;
      z-index: 2;
    }

    .hero-overlay {
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0, 0, 0, 0.4); /* Lớp phủ tối màu */
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      color: white;
    }

    /* Hiệu ứng chữ chạy lên */
    .hero-content {
      max-width: 800px;
      padding: 20px;
      animation: slideUp 1s ease-out forwards; 
      opacity: 0; 
      transform: translateY(30px);
    }

    /* Khi slide active thì content mới chạy animation */
    .hero-slide.active .hero-content {
      opacity: 1;
      transform: translateY(0);
      transition: opacity 0.8s 0.5s, transform 0.8s 0.5s; /* Delay 0.5s */
    }

    .hero-title {
      font-size: 3.5rem;
      font-weight: 800;
      margin-bottom: 15px;
      text-transform: uppercase;
      letter-spacing: 2px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
    }
    
    .hero-title-highlight {
      color: #FBD865; /* Màu vàng thương hiệu */
    }

    .hero-subtitle {
      font-size: 1.4rem;
      font-weight: 300;
      margin-bottom: 30px;
      font-style: italic;
      text-shadow: 1px 1px 3px rgba(0,0,0,0.5);
    }

    .homepage-btn {
      padding: 14px 40px;
      background: transparent;
      border: 2px solid #FBD865;
      color: #FBD865;
      font-size: 1.1rem;
      text-transform: uppercase;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
      border-radius: 30px;
    }

    .homepage-btn:hover {
      background: #FBD865;
      color: #333;
      transform: scale(1.05);
      box-shadow: 0 5px 15px rgba(251, 216, 101, 0.4);
    }

    /* Dots Navigation */
    .slider-dots {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 10px;
      z-index: 10;
    }
    .dot {
      width: 12px;
      height: 12px;
      background: rgba(255,255,255,0.5);
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.3s;
    }
    .dot.active {
      background: #FBD865;
      transform: scale(1.2);
    }

    @media (max-width: 768px) {
      .hero-slider-container { height: 400px; }
      .hero-title { font-size: 2rem; }
      .hero-subtitle { font-size: 1rem; }
    }
  `;

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
      {/* Inject CSS Slider */}
      <StyleInjector styles={sliderStyles} />

      {/* --- HERO SLIDER MỚI --- */}
      <div className="hero-slider-container">
        {slides.map((slide, index) => (
          <div 
            key={index}
            className={`hero-slide ${index === activeSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="hero-overlay">
              <div className="hero-content">
                <h1 className="hero-title">
                  {index === 0 ? (
                     // Slide đầu tiên có style đặc biệt cho "Tranh Xịn"
                     <>
                        <span className="hero-title-highlight">"Tranh Xịn"</span> <br/>
                        Thương Hiệu Hàng Đầu
                     </>
                  ) : (
                     slide.title
                  )}
                </h1>
                <div className="hero-subtitle">{slide.subtitle}</div>
                <button className="homepage-btn" onClick={handleViewAllProducts}>
                  Xem Ngay
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Dots Navigation */}
        <div className="slider-dots">
          {slides.map((_, index) => (
            <div 
              key={index} 
              className={`dot ${index === activeSlide ? 'active' : ''}`}
              onClick={() => setActiveSlide(index)}
            />
          ))}
        </div>
      </div>
      {/* --- KẾT THÚC SLIDER --- */}


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
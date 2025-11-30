import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// --- STYLE INJECTOR ---
const StyleInjector = ({ styles }) => {
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
    return () => document.head.removeChild(styleElement);
  }, [styles]);
  return null;
};

// --- ICONS ---
const FaQuoteLeft = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path></svg>;
const FaPaintBrush = () => <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z"/><path d="m15 6.5-3.187 3.187"/></svg>;
const FaGem = () => <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/></svg>;
const FaUsers = () => <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const FaHeart = () => <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>;

export default function AboutUs() {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      image: "abc.jpg",
      title: "Nghệ Thuật Là Hơi Thở",
      subtitle: "Khơi dậy cảm xúc trong từng nét vẽ"
    },
    {
      image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2071&auto=format&fit=crop",
      title: "Không Gian Sống Đẳng Cấp",
      subtitle: "Biến ngôi nhà thành tác phẩm nghệ thuật"
    },
    {
      image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=2070&auto=format&fit=crop",
      title: "Sáng Tạo Không Giới Hạn",
      subtitle: "Đa dạng phong cách, độc bản cá tính"
    }
  ];

  // Auto Slider Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // --- CSS STYLES ---
  const styles = `
    .about-page {
      font-family: 'Segoe UI', sans-serif;
      color: #333;
      overflow-x: hidden;
    }
    
    /* HERO SLIDER */
    .about-hero {
      position: relative;
      height: 600px;
      width: 100%;
      overflow: hidden;
    }
    .hero-slide {
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      background-size: cover;
      background-position: center;
      opacity: 0;
      transition: opacity 1s ease-in-out;
    }
    .hero-slide.active { opacity: 1; }
    .hero-overlay {
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.4);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      color: white;
    }
    .hero-content {
      max-width: 800px;
      padding: 20px;
      animation: slideUp 1s ease-out;
    }
    .hero-title {
      font-size: 3.5rem;
      font-weight: 700;
      margin-bottom: 20px;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    .hero-subtitle {
      font-size: 1.5rem;
      font-weight: 300;
      margin-bottom: 30px;
      font-style: italic;
    }
    .hero-btn {
      padding: 12px 35px;
      background: transparent;
      border: 2px solid white;
      color: white;
      font-size: 1rem;
      text-transform: uppercase;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      text-decoration: none;
      display: inline-block;
    }
    .hero-btn:hover {
      background: white;
      color: #333;
    }
    
    /* STORY SECTION */
    .story-section {
      padding: 80px 20px;
      max-width: 1100px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 50px;
      align-items: center;
    }
    .story-img {
      width: 100%;
      border-radius: 10px;
      box-shadow: 0 15px 30px rgba(0,0,0,0.1);
      transition: transform 0.3s;
    }
    .story-img:hover { transform: scale(1.02); }
    .story-content h2 {
      font-size: 2.5rem;
      margin-bottom: 20px;
      color: #222;
    }
    .story-content p {
      font-size: 1.1rem;
      line-height: 1.8;
      color: #666;
      margin-bottom: 20px;
    }
    .story-signature {
      font-family: 'Brush Script MT', cursive;
      font-size: 1.5rem;
      color: #444;
      text-align: right;
      margin-top: 20px;
    }

    /* VALUES SECTION */
    .values-section {
      background-color: #f9f9f9;
      padding: 80px 20px;
      text-align: center;
    }
    .section-header { margin-bottom: 60px; }
    .section-header h2 { font-size: 2.5rem; margin-bottom: 10px; }
    .section-header .line {
      width: 60px; height: 3px; background: #d4a574; margin: 0 auto;
    }
    
    .values-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 30px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .value-card {
      background: white;
      padding: 40px 20px;
      border-radius: 8px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.05);
      transition: transform 0.3s;
    }
    .value-card:hover { transform: translateY(-10px); }
    .value-icon {
      color: #d4a574;
      margin-bottom: 20px;
    }
    .value-title {
      font-size: 1.2rem;
      font-weight: 700;
      margin-bottom: 15px;
    }
    .value-desc {
      color: #666;
      font-size: 0.95rem;
      line-height: 1.6;
    }

    /* STATS BANNER */
    .stats-banner {
      background: #222;
      color: white;
      padding: 60px 20px;
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      text-align: center;
    }
    .stat-item { margin: 20px; }
    .stat-number { font-size: 3rem; font-weight: 800; color: #d4a574; display: block; }
    .stat-label { font-size: 1rem; text-transform: uppercase; letter-spacing: 1px; opacity: 0.8; }

    /* TEAM SECTION */
    .team-section {
      padding: 80px 20px;
      text-align: center;
    }
    .team-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 40px;
      max-width: 1000px;
      margin: 0 auto;
    }
    .team-member img {
      width: 150px; height: 150px;
      border-radius: 50%;
      object-fit: cover;
      margin-bottom: 20px;
      border: 3px solid white;
      box-shadow: 0 0 0 2px #d4a574;
    }
    .team-name { font-size: 1.2rem; font-weight: 700; }
    .team-role { color: #888; font-size: 0.9rem; font-style: italic; margin-bottom: 10px; display: block;}

    /* FOOTER CTA */
    .cta-section {
      background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=2070');
      background-size: cover;
      background-attachment: fixed;
      color: white;
      text-align: center;
      padding: 100px 20px;
    }
    .cta-title { font-size: 2.5rem; margin-bottom: 20px; }
    .cta-btn {
      background: #d4a574;
      color: white;
      padding: 15px 40px;
      border: none;
      border-radius: 30px;
      font-size: 1.1rem;
      font-weight: bold;
      cursor: pointer;
      transition: background 0.3s;
      text-decoration: none;
      display: inline-block;
    }
    .cta-btn:hover { background: #b58654; }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 768px) {
      .hero-title { font-size: 2.5rem; }
      .story-section { grid-template-columns: 1fr; text-align: center; }
      .story-signature { text-align: center; }
    }
  `;

  return (
    <>
      <StyleInjector styles={styles} />
      <div className="about-page">
        
        {/* 1. HERO SLIDER */}
        <section className="about-hero">
          {slides.map((slide, index) => (
            <div 
              key={index} 
              className={`hero-slide ${index === activeSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="hero-overlay">
                {index === activeSlide && (
                  <div className="hero-content">
                    <h1 className="hero-title">{slide.title}</h1>
                    <p className="hero-subtitle">{slide.subtitle}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </section>

        {/* 2. STORY */}
        <section className="story-section">
          <div>
            <img src="/story.webp" alt="Our Story" className="story-img" />
          </div>
          <div className="story-content">
            <h2>Về chúng tôi</h2>
            <p>
              Được thành lập vào năm 2015, Tranh Xịn khởi đầu từ niềm đam mê cháy bỏng với nghệ thuật thị giác và mong muốn mang cái đẹp đến từng không gian sống của người Việt.
            </p>
            <p>
              Chúng tôi tin rằng mỗi bức tranh không chỉ là vật trang trí, mà là một câu chuyện, một cảm xúc và là linh hồn của căn phòng. Từ những nét cọ sơn dầu cổ điển đến những hình khối trừu tượng hiện đại, chúng tôi tuyển chọn kỹ lưỡng từng tác phẩm để đảm bảo sự độc đáo và chất lượng hoàn hảo nhất.
            </p>
            <div className="story-signature">
              - Đội ngũ Tranh Xịn
            </div>
          </div>
        </section>

        {/* 3. VALUES */}
        <section className="values-section">
          <div className="section-header">
            <h2>Giá Trị Cốt Lõi</h2>
          </div>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon"><FaGem /></div>
              <h3 className="value-title">Chất Lượng Đỉnh Cao</h3>
              <p className="value-desc">Sử dụng chất liệu Canvas cao cấp, màu acrylic bền bỉ và khung gỗ tự nhiên đã qua xử lý mối mọt.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><FaPaintBrush /></div>
              <h3 className="value-title">Nghệ Thuật Độc Bản</h3>
              <p className="value-desc">Hợp tác với các họa sĩ trẻ tài năng để mang đến những tác phẩm sáng tạo, không đụng hàng.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><FaHeart /></div>
              <h3 className="value-title">Tận Tâm Phục Vụ</h3>
              <p className="value-desc">Tư vấn tận tình, hỗ trợ ướm tranh ảo vào tường nhà bạn và chính sách bảo hành trọn đời.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><FaUsers /></div>
              <h3 className="value-title">Cộng Đồng</h3>
              <p className="value-desc">Kết nối những người yêu nghệ thuật, tổ chức các workshop và triển lãm thường niên.</p>
            </div>
          </div>
        </section>

        {/* 4. STATS */}
        <section className="stats-banner">
          <div className="stat-item">
            <span className="stat-number">5000+</span>
            <span className="stat-label">Tác phẩm đã bán</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">120+</span>
            <span className="stat-label">Họa sĩ hợp tác</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">10</span>
            <span className="stat-label">Năm kinh nghiệm</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">99%</span>
            <span className="stat-label">Khách hàng hài lòng</span>
          </div>
        </section>

        {/* 5. TEAM */}
        <section className="team-section">
          <div className="section-header">
            <h2>Gặp Gỡ Đội Ngũ</h2>
          </div>
          <div className="team-grid">
            <div className="team-member">
              <img src="elon.jpg" alt="CEO" />
              <h3 className="team-name">Elon Musk</h3>
              <span className="team-role">Nhà Sáng Lập & CEO</span>
              <p>Người định hướng tầm nhìn nghệ thuật cho Tranh Xịn.</p>
            </div>
            <div className="team-member">
              <img src="/ceo.jpg" alt="Curator" />
              <h3 className="team-name">Phan Cẩm Cường</h3>
              <span className="team-role">Giám Đốc Sáng Tạo</span>
              <p>Tuyển chọn và thẩm định từng tác phẩm trước khi đến tay bạn.</p>
            </div>
            <div className="team-member">
              <img src="/cr7.jpg" alt="Artist" />
              <h3 className="team-name">Cristiano Ronaldo</h3>
              <span className="team-role">Trưởng Nhóm Họa Sĩ</span>
              <p>Họa sĩ sơn dầu với 15 năm kinh nghiệm sáng tác.</p>
            </div>
          </div>
        </section>

        {/* 6. CTA FOOTER */}
        <section className="cta-section">
          <h2 className="cta-title">Bạn Đã Sẵn Sàng Thay Đổi Không Gian Sống?</h2>
          <Link to="/products" className="cta-btn">Mua Sắm Ngay</Link>
        </section>

      </div>
    </>
  );
}


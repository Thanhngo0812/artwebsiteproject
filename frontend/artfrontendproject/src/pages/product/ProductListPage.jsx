import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import ProductCard from "../../components/ProductCard";
import ReactPaginate from "react-paginate";
import "./css/ProductListPage.css";

const API_BASE = "http://localhost:8888/api/products";

export default function ProductListPage() {
  const [searchParams] = useSearchParams();
  const sortType = searchParams.get("sort"); // featured, newest, bestseller
  const searchQuery = searchParams.get("q");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 20;

  useEffect(() => {
    fetchProducts();
  }, [sortType, searchQuery ,currentPage]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let endpoint = "";
      let params = { page: currentPage, size: pageSize };

      if (searchQuery) {
        const response = await axios.get(`${API_BASE}/search-query`, {
          params: { q: searchQuery, limit: 50 }
        });
        
        setProducts(response.data);
        setTotalPages(1);
        setLoading(false);
        return;
      }

      switch (sortType) {
        case "featured":
          endpoint = `${API_BASE}/featured`;
          break;
        case "newest":
          endpoint = `${API_BASE}/newest`;
          break;
        case "bestseller":
          endpoint = `${API_BASE}/search`;
          params.sort = "salesCount,desc";
          break;
        default:
          endpoint = `${API_BASE}`;
      }

      const response = await axios.get(endpoint, { params });
      
      // Handle both array and paginated response
      if (Array.isArray(response.data)) {
        setProducts(response.data);
        setTotalPages(1);
      } else {
        setProducts(response.data.content || []);
        setTotalPages(response.data.totalPages || 1);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  const handlePageClick = (e) => {
    setCurrentPage(e.selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getTitleBySortType = () => {
    
    if (searchQuery) {
      return `Kết quả tìm kiếm cho "${searchQuery}"`;
    }
    
    switch (sortType) {
      case "featured":
        return "Sản Phẩm Nổi Bật";
      case "newest":
        return "Sản Phẩm Mới Nhất";
      case "bestseller":
        return "Sản Phẩm Bán Chạy";
      default:
        return "Tất Cả Sản Phẩm";
    }
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
    <div className="product-list-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Trang chủ</Link>
        <span> / </span>
        <span>{getTitleBySortType()}</span>
      </div>

      {/* Title */}
      <h1 className="page-title">{getTitleBySortType()}</h1>

      {searchQuery && (
        <p className="search-count">
          {products.length > 0 
            ? `Tìm thấy ${products.length} sản phẩm` 
            : 'Không có kết quả nào'}
        </p>
      )}

      {/* Product Grid */}
      {products.length > 0 ? (
        <>
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <ReactPaginate
              breakLabel="..."
              nextLabel="›"
              onPageChange={handlePageClick}
              pageRangeDisplayed={3}
              marginPagesDisplayed={2}
              pageCount={totalPages}
              previousLabel="‹"
              renderOnZeroPageCount={null}
              containerClassName="pagination"
              pageLinkClassName="page-num"
              previousLinkClassName="page-num"
              nextLinkClassName="page-num"
              activeLinkClassName="active"
              forcePage={currentPage}
            />
          )}
        </>
      ) : (
        <div className="no-products">
          {searchQuery ? (
            <>
              <p>Không tìm thấy sản phẩm nào với từ khóa "<strong>{searchQuery}</strong>"</p>
              <Link to="/products" className="back-btn">
                Xem tất cả sản phẩm
              </Link>
            </>
          ) : (
            <>
              <p>Không tìm thấy sản phẩm nào.</p>
              <Link to="/products" className="back-btn">
                ← Quay lại cửa hàng
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
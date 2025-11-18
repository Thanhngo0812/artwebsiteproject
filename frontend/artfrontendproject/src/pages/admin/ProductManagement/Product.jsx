import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

// =======================================================
// 1. Component StyleInjector
// =======================================================
const StyleInjector = ({ styles }) => {
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, [styles]);
  return null;
};

// =======================================================
// 2. Icons
// =======================================================
const faChevronUp = (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor"><path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"/></svg>);
const faChevronDown = (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>);
const faEdit = (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor"><path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9L489.4 100c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.8 15.8-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h144c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"/></svg>);
const faTrash = (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="1em" height="1em" fill="currentColor"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>);
const faLock = (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="1em" height="1em" fill="currentColor"><path d="M144 144v-32c0-53 43-96 96-96s96 43 96 96v32C352 166.7 365.3 180 384 180s32-13.3 32-32V112C416 50.1 365.9 0 304 0S192 50.1 192 112v32c0 17.7 14.3 32 32 32s32-14.3 32-32zM320 192H128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V256c0-35.3-28.7-64-64-64zM224 384c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z"/></svg>);
const faUnlock = (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="1em" height="1em" fill="currentColor"><path d="M144 144v-32c0-53 43-96 96-96s96 43 96 96v32C352 166.7 365.3 180 384 180s32-13.3 32-32V112C416 50.1 365.9 0 304 0S192 50.1 192 112v32c0 17.7 14.3 32 32 32s32-14.3 32-32zM320 192H128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V256c0-35.3-28.7-64-64-64zM224 384c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32s-14.3 32-32 32z"/></svg>);
const faPlus = (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="1em" height="1em" fill="currentColor"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>);
const faWarning = (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor"><path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40C25.7 480 13.7 467.1 13.4 452s7-27.7 14.3-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/></svg>);

const FontAwesomeIcon = ({ icon, style }) => {
  return (
    <span style={{ ...style, display: 'inline-block', width: '1em', height: '1em', verticalAlign: 'middle' }}>
      {icon}
    </span>
  );
};

// =======================================================
// 3. Modal
// =======================================================
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmButtonText, confirmButtonClass }) => {
  if (!isOpen) return null;
  return (
    <div className="confirm-modal-overlay" onClick={onClose}>
      <div className="confirm-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-modal-header">
          <FontAwesomeIcon icon={faWarning} style={{ color: confirmButtonClass === 'btn-danger' ? '#dc3545' : '#ffc107' }} />
          <h3>{title}</h3>
        </div>
        <div className="confirm-modal-body">
          <p>{message}</p>
        </div>
        <div className="confirm-modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>Hủy</button>
          <button type="button" className={confirmButtonClass} onClick={onConfirm}>
            {confirmButtonText || "Xác nhận"}
          </button>
        </div>
      </div>
    </div>
  );
};

const API_BASE_URL = "http://localhost:8888";
const getAuthToken = () => localStorage.getItem('user');
const createAuthHeaders = () => {
    const token = getAuthToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};
const formatCurrency = (value) => {
    if (!value) return "0 ₫";
    return value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
};

export default function ProductAdmin() {
  const [openFilter, setOpenFilter] = useState(true);
  const [filterData, setFilterData] = useState({ categories: [], materials: [] });
  const [filters, setFilters] = useState({
    id: "", productName: "", categoryId: "", materialId: "", status: "", minPrice: "", maxPrice: ""
  });
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({});

  // Load Filter Data
  useEffect(() => {
    const fetchFilterData = async () => {
        try {
            const headers = createAuthHeaders();
            const catResponse = await axios.get(`${API_BASE_URL}/api/v1/categories/all`, { headers });
            const matResponse = await axios.get(`${API_BASE_URL}/api/v1/materials/all`, { headers });

            const categoriesData = Array.isArray(catResponse.data) ? catResponse.data : (catResponse.data?.content || []);
            const materialsData = Array.isArray(matResponse.data) ? matResponse.data : (matResponse.data?.content || []);

            setFilterData({ categories: categoriesData, materials: materialsData });
        } catch (error) {
            console.error("Lỗi tải filter:", error);
        }
    };
    fetchFilterData();
  }, []);

  // Load Products
  const fetchProducts = useCallback(async () => {
    try {
        const headers = createAuthHeaders();
        const params = {
            page: currentPage - 1, size: pageSize,
            ...(filters.id && { id: filters.id }),
            ...(filters.productName && { productName: filters.productName }),
            ...(filters.categoryId && { categoryId: filters.categoryId }),
            ...(filters.materialId && { materialId: filters.materialId }),
            ...(filters.status && { status: filters.status }),
            ...(filters.minPrice && { minPrice: filters.minPrice }),
            ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
        };
        const response = await axios.get(`${API_BASE_URL}/api/v1/admin/products/search`, { params, headers });
        setProducts(response.data.content);
        setTotalPages(response.data.totalPages);
    } catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
        setProducts([]);
        setTotalPages(0);
    }
  }, [filters, currentPage, pageSize]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // Action Handlers
  const handleResetFilters = () => {
    setFilters({ id: "", productName: "", categoryId: "", materialId: "", status: "", minPrice: "", maxPrice: "" });
    setCurrentPage(1);
  };
  const handleFiltersChange = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));
  const handleFiltersChangeSelect = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
        window.scrollTo(0, 0);
        setCurrentPage(newPage);
    }
  };

  const handleAddNew = () => navigate('/admin/product/new');
  const handleEditProduct = (productId) => navigate(`/admin/product/edit/${productId}`);

  // Delete Logic
  const triggerDeleteProduct = (productId) => {
    setModalContent({
        title: "Xác nhận Xóa",
        message: `Bạn có chắc muốn xóa vĩnh viễn SP ID: ${productId}?`,
        action: () => confirmDeleteProduct(productId),
        confirmButtonText: "Xóa ngay",
        confirmButtonClass: "btn-danger"
    });
    setIsModalOpen(true);
  };
  const confirmDeleteProduct = async (productId) => {
    setIsModalOpen(false);
    try {
        await axios.delete(`${API_BASE_URL}/api/v1/admin/products/${productId}`, { headers: createAuthHeaders() });
        toast.success("Đã xóa sản phẩm!");
        fetchProducts();
    } catch (error) {
        toast.error("Xóa thất bại. Sản phẩm này đã được bán và không thể xóa.");
    }
  };

  // Status Toggle Logic
  const triggerToggleStatus = (productId, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    const actionText = newStatus === 1 ? "Hiện" : "Ẩn";
    setModalContent({
        title: `Xác nhận ${actionText}`,
        message: `Bạn muốn "${actionText}" SP ID: ${productId}?`,
        action: () => confirmToggleStatus(productId, newStatus),
        confirmButtonText: `${actionText} ngay`,
        confirmButtonClass: "btn-warning"
    });
    setIsModalOpen(true);
  };
  const confirmToggleStatus = async (productId, newStatus) => {
    setIsModalOpen(false);
    try {
        await axios.put(`${API_BASE_URL}/api/v1/admin/products/${productId}/status`, { status: newStatus }, { headers: createAuthHeaders() });
        toast.success("Cập nhật thành công!");
        fetchProducts();
    } catch (error) {
        toast.error("Cập nhật thất bại.");
    }
  };

  const handleCloseModal = () => setIsModalOpen(false);
  const handleConfirmModal = () => modalContent.action && modalContent.action();
  
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  // =======================================================
  // CSS TỐI ƯU: BOX/CARD VIEW TRÊN MOBILE
  // =======================================================
  const allStyles = `
  :root {
    --primary-color: #007bff;
    --success-color: #28a745;
    --danger-color: #dc3545;
    --warning-color: #ffc107;
    --text-dark: #333;
    --text-light: #6c757d;
    --bg-light: #f4f7fa;
  }

  .product-admin-container {
    padding: 20px;
    font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background-color: var(--bg-light);
    min-height: 100vh;
  }

  /* --- Filters Section --- */
  .filters-content {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    padding: 20px;
    margin-bottom: 24px;
  }
  .filters-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--text-dark);
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    user-select: none;
  }
  .btn-clear {
    background: #fff;
    border: 1px solid #e9ecef;
    color: var(--danger-color);
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: 0.2s;
  }
  .btn-clear:hover {
    background: #fff5f5;
    border-color: var(--danger-color);
  }
  
  .filters-items {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
    margin-top: 20px;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .filters-items.close {
    max-height: 0;
    margin-top: 0;
    opacity: 0;
  }
  .filters-items.open {
    max-height: 1200px;
    opacity: 1;
  }
  
  .item label {
    display: block;
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--text-light);
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .item input, .item select {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #ced4da;
    border-radius: 8px;
    font-size: 0.95rem;
    transition: border-color 0.2s;
    box-sizing: border-box;
  }
  .item input:focus, .item select:focus {
    border-color: var(--primary-color);
    outline: none;
    box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
  }

  /* --- Products Table Section --- */
  .show-products {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    padding: 24px;
  }
  .show-products_title_container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 15px;
  }
  .show-products_title {
    font-size: 1.4rem;
    font-weight: 800;
    color: var(--text-dark);
  }
  .btn-add-new {
    background: var(--success-color);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(40,167,69,0.2);
    transition: transform 0.2s;
  }
  .btn-add-new:active { transform: translateY(2px); }

  /* BASIC TABLE STYLES */
  .table-container {
    width: 100%;
    /* Không cần overflow-x nữa vì sẽ dùng card view trên mobile */
  }

  .products-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
  }
  
  .products-table thead th {
    background: #f8f9fa;
    padding: 14px 16px;
    text-align: left;
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--text-light);
    text-transform: uppercase;
    border-bottom: 2px solid #dee2e6;
    white-space: nowrap;
  }

  .products-table tbody tr td {
    padding: 14px 16px;
    vertical-align: middle;
    border-bottom: 1px solid #f0f0f0;
    color: var(--text-dark);
    font-size: 0.95rem;
  }
  .products-table tbody tr:hover {
    background-color: #f9fbff;
  }
  
  .product-thumbnail-cell img {
    width: 48px;
    height: 48px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid #dee2e6;
  }

  /* Status Badge */
  .status-badge {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    min-width: 80px;
  }
  .status-badge.active {
    background-color: #d4edda;
    color: #155724;
  }
  .status-badge.inactive {
    background-color: #f8d7da;
    color: #721c24;
  }

  /* Actions */
  .action-buttons {
    display: flex;
    gap: 8px;
  }
  .action-buttons button {
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-edit { background: #e7f1ff; color: var(--primary-color); }
  .btn-edit:hover { background: var(--primary-color); color: white; }
  
  .btn-toggle-status { background: #fff3cd; color: #856404; }
  .btn-toggle-status:hover { background: var(--warning-color); color: black; }
  
  .btn-delete { background: #ffe3e3; color: var(--danger-color); }
  .btn-delete:hover { background: var(--danger-color); color: white; }

  /* Pagination */
  .pagination {
    margin-top: 24px;
    display: flex;
    justify-content: center;
    gap: 8px;
  }
  .pagination button {
    padding: 8px 16px;
    border: 1px solid #dee2e6;
    background: white;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    color: var(--primary-color);
  }
  .pagination button:hover:not(:disabled) {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
  }
  .pagination button:disabled {
    background: #f8f9fa;
    color: #adb5bd;
    cursor: not-allowed;
  }

  /* Modal Styles */
  .confirm-modal-overlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(2px);
    display: flex; align-items: center; justify-content: center;
    z-index: 9999;
    padding: 20px;
  }
  .confirm-modal-box {
    background: white;
    padding: 24px;
    border-radius: 16px;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    animation: slideUp 0.3s ease;
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .confirm-modal-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; font-size: 1.25rem; font-weight: 700; }
  .confirm-modal-body p { color: var(--text-light); line-height: 1.5; margin-bottom: 24px; }
  .confirm-modal-actions { display: flex; gap: 12px; justify-content: flex-end; }
  .confirm-modal-actions button {
    padding: 10px 20px; border-radius: 8px; font-weight: 600; border: none; cursor: pointer;
  }
  .btn-secondary { background: #e9ecef; color: var(--text-dark); }
  .btn-danger { background: var(--danger-color); color: white; }
  .btn-warning { background: var(--warning-color); color: black; }

  /* --- RESPONSIVE TABLET --- */
  @media (max-width: 1024px) {
    .product-admin-container { padding: 15px; }
    .show-products { padding: 15px; }
  }

  /* --- ⭐ MOBILE CARD VIEW (Đã sửa lỗi chồng chữ) --- */
  @media (max-width: 768px) {
    .product-admin-container { padding: 10px; }
    
    .filters-items { grid-template-columns: 1fr; gap: 12px; }
    
    .show-products_title_container {
      flex-direction: column;
      align-items: stretch;
    }
    .show-products_title { font-size: 1.2rem; text-align: center; margin-bottom: 10px;}
    .btn-add-new { justify-content: center; width: 100%; }

    /* 1. Ẩn header bảng */
    .products-table thead { display: none; }
    
    /* 2. Biến bảng thành block */
    .products-table, .products-table tbody, .products-table tr, .products-table td {
        display: block;
        width: 100%;
        box-sizing: border-box;
    }
    
    /* 3. Style cho mỗi Card (tr) */
    .products-table tr {
        background: #fff;
        margin-bottom: 20px;
        border: 1px solid #e9ecef;
        border-radius: 12px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.03);
        overflow: hidden;
    }
    
    /* 4. FIX LỖI CHỒNG CHỮ TẠI ĐÂY */
    .products-table td {
        /* Dùng Flexbox để chia 2 đầu: Trái (Label) - Phải (Value) */
        display: flex; 
        justify-content: space-between; 
        align-items: center; /* Căn giữa dọc */
        
        padding: 12px 15px;
        border-bottom: 1px solid #f0f0f0;
        text-align: right; /* Nội dung mặc định căn phải */
        min-height: 50px; /* Đảm bảo độ cao tối thiểu */
    }
    
    /* 5. Label giả (Bên trái) */
    .products-table td::before {
        content: attr(data-label);
        /* QUAN TRỌNG: Bỏ absolute, dùng static để chiếm chỗ thật */
        position: static; 
        
        font-weight: 700;
        font-size: 0.8rem;
        color: #6c757d;
        text-transform: uppercase;
        text-align: left;
        
        /* Đảm bảo Label không bị co lại và cách nội dung ra */
        flex-shrink: 0; 
        margin-right: 20px; 
        white-space: nowrap;
    }
    
    /* Xử lý riêng cho dòng nút bấm (cuối cùng) */
    .products-table tr td:last-child {
        border-bottom: none;
        justify-content: center; /* Căn giữa nút */
        padding-top: 15px;
        padding-bottom: 15px;
        background-color: #fcfcfc;
    }
    /* Ẩn label của dòng nút bấm */
    .products-table tr td:last-child::before {
        display: none; 
    }
    
    /* Xử lý riêng cho hình ảnh */
    .product-thumbnail-cell {
        /* Ảnh vẫn nằm bên phải nhờ justify-content: space-between của cha */
        width: auto; 
    }

    .pagination { font-size: 0.9rem; }
    .pagination span { display: none; }
  }
  `;

  return (
    <>
      <StyleInjector styles={allStyles} />
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmModal}
        title={modalContent.title}
        message={modalContent.message}
        confirmButtonText={modalContent.confirmButtonText}
        confirmButtonClass={modalContent.confirmButtonClass}
      />
      <div className="product-admin-container">
        {/* --- FILTERS --- */}
        <div className="filters-content">
          <div className="filters-title" onClick={() => setOpenFilter(!openFilter)}>
            <span>BỘ LỌC TÌM KIẾM</span>
            <FontAwesomeIcon icon={openFilter ? faChevronUp : faChevronDown} />
          </div>

          <div className={`filters-items ${openFilter ? "open" : "close"}`}>
            <div className="item"><label>ID SẢN PHẨM</label>
              <input type="text" placeholder="Nhập ID..." value={filters.id} onChange={(e) => handleFiltersChange("id", e.target.value)} />
            </div>
            <div className="item"><label>TÊN SẢN PHẨM</label>
              <input type="text" placeholder="Nhập tên..." value={filters.productName} onChange={(e) => handleFiltersChange("productName", e.target.value)} />
            </div>
            <div className="item"><label>DANH MỤC</label>
              <select value={filters.categoryId} onChange={(e) => handleFiltersChangeSelect("categoryId", e.target.value)}>
                <option value="">Tất cả</option>
                {Array.isArray(filterData.categories) && filterData.categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
            <div className="item"><label>CHẤT LIỆU</label>
              <select value={filters.materialId} onChange={(e) => handleFiltersChangeSelect("materialId", e.target.value)}>
                <option value="">Tất cả</option>
                {Array.isArray(filterData.materials) && filterData.materials.map(mat => <option key={mat.id} value={mat.id}>{mat.materialName}</option>)}
              </select>
            </div>
            <div className="item"><label>TRẠNG THÁI</label>
              <select value={filters.status} onChange={(e) => handleFiltersChangeSelect("status", e.target.value)}>
                <option value="">Tất cả</option>
                <option value="1">Hoạt động</option>
                <option value="0">Tạm khóa</option>
              </select>
            </div>
            <div className="item"><label>GIÁ TỐI THIỂU</label>
              <input type="number" placeholder="0" value={filters.minPrice} onChange={(e) => handleFiltersChange("minPrice", e.target.value)} />
            </div>
            <div className="item"><label>GIÁ TỐI ĐA</label>
              <input type="number" placeholder="Tối đa..." value={filters.maxPrice} onChange={(e) => handleFiltersChange("maxPrice", e.target.value)} />
            </div>
          </div>
          
          {openFilter && (
            <div style={{ marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '15px', textAlign: 'right' }}>
               <button className="btn-clear" onClick={handleResetFilters}>Xóa bộ lọc</button>
            </div>
          )}
        </div>

        {/* --- TABLE --- */}
        <div className="show-products">
          <div className="show-products_title_container">
              <div className="show-products_title">DANH SÁCH SẢN PHẨM</div>
              <button className="btn-add-new" onClick={handleAddNew}>
                  <FontAwesomeIcon icon={faPlus} /> Thêm Mới
              </button>
          </div>
          
          <div className="table-container">
            <table className="products-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Ảnh</th>
                  <th>Tên Sản Phẩm</th>
                  <th>Danh Mục</th>
                  <th>Chất Liệu</th>
                  <th>Giá (Min)</th>
                  <th style={{textAlign: 'center'}}>Trạng Thái</th>
                  <th>Ngày Tạo</th>
                  <th style={{textAlign: 'center'}}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr><td colSpan="9" style={{textAlign: "center", padding: "40px", color: "#888"}}>Không tìm thấy sản phẩm nào</td></tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id}>
                      {/* ⭐ QUAN TRỌNG: Thêm data-label cho chế độ Mobile Card */}
                      <td data-label="ID"><b>#{product.id}</b></td>
                      <td data-label="Ảnh">
                          <div className="product-thumbnail-cell">
                            <img src={product.thumbnail || 'https://placehold.co/50x50?text=NoImg'} alt="" />
                          </div>
                      </td>
                      <td data-label="Tên SP"><span style={{fontWeight: 500}}>{product.productName}</span></td>
                      <td data-label="Danh Mục">{Array.isArray(product.categories) ? product.categories.join(', ') : '-'}</td>
                      <td data-label="Chất Liệu">{product.material || '-'}</td>
                      <td data-label="Giá Min" style={{color: '#d63384', fontWeight: 'bold'}}>{formatCurrency(product.minPrice)}</td>
                      <td data-label="Trạng Thái" style={{textAlign: 'right'}}> 
                        {/* Mobile card view sẽ tự align right */}
                        <span className={`status-badge ${product.productStatus === 1 ? "active" : "inactive"}`}>
                          {product.productStatus === 1 ? "Hoạt động" : "Tạm khóa"}
                        </span>
                      </td>
                      <td data-label="Ngày Tạo">{formatDate(product.createdAt)}</td>
                      <td data-label="Hành động">
                        <div className="action-buttons" style={{justifyContent: 'flex-end'}}> {/* Căn phải trên Desktop, Center trên Mobile do CSS override */}
                          <button className="btn-edit" onClick={() => handleEditProduct(product.id)} title="Sửa"><FontAwesomeIcon icon={faEdit} /></button>
                          <button className="btn-toggle-status" onClick={() => triggerToggleStatus(product.id, product.productStatus)} title="Đổi trạng thái">
                            {product.productStatus === 1 ? <FontAwesomeIcon icon={faLock} /> : <FontAwesomeIcon icon={faUnlock} />}
                          </button>
                          <button className="btn-delete" onClick={() => triggerDeleteProduct(product.id)} title="Xóa"><FontAwesomeIcon icon={faTrash} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Trước</button>
              <span style={{ display: 'flex', alignItems: 'center' }}>Trang {currentPage} / {totalPages}</span>
              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Sau</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = "http://localhost:8888";

// --- HELPERS ---
const getAuthToken = () => localStorage.getItem('accessToken');
const createAuthHeaders = () => {
    const token = getAuthToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// --- ICONS ---
const faPlus = <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 448 512" fill="currentColor"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>;
const faTrash = <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 448 512" fill="currentColor"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>;
const faCheck = <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 448 512" fill="currentColor"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>;
// MỚI: Icon Cảnh báo cho modal xác nhận
const faWarning = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor"><path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40C25.7 480 13.7 467.1 13.4 452s7-27.7 14.3-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/></svg>;

// =======================================================
// MỚI: Component Modal Xác Nhận
// =======================================================
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-modal-overlay" onClick={onClose}>
      <div className="confirm-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-modal-header">
          <span className="warning-icon">{faWarning}</span>
          <h3>{title}</h3>
        </div>
        <div className="confirm-modal-body">
          <p>{message}</p>
        </div>
        <div className="confirm-modal-actions">
          <button className="btn-secondary" onClick={onClose}>Hủy</button>
          <button className="btn-danger" onClick={onConfirm}>Xác nhận Xóa</button>
        </div>
      </div>
    </div>
  );
};

export default function ProductPromotionManagement() {
  const [promotions, setPromotions] = useState([]);
  const [selectedPromo, setSelectedPromo] = useState(null);
  
  const [activeTab, setActiveTab] = useState('PRODUCTS'); // 'PRODUCTS' | 'CATEGORIES'
  
  const [assignedProducts, setAssignedProducts] = useState([]);
  const [assignedCategories, setAssignedCategories] = useState([]);
  
  // Modal Thêm Sản phẩm
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [allProducts, setAllProducts] = useState([]); // Dùng để search và chọn
  const [productSearch, setProductSearch] = useState('');

  // Modal Thêm Danh mục
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [allCategories, setAllCategories] = useState([]);

  // =======================================================
  // MỚI: State cho Modal Xác Nhận
  // =======================================================
  const [confirmData, setConfirmData] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null // Lưu hành động cần thực hiện
  });

  // 1. Load danh sách khuyến mãi
  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/v1/admin/promotions`, { headers: createAuthHeaders() })
      .then(res => setPromotions(res.data.content || []))
      .catch(err => toast.error("Lỗi tải danh sách khuyến mãi"));
  }, []);

  // 2. Load chi tiết khi chọn khuyến mãi
  useEffect(() => {
    if (!selectedPromo) return;
    loadAssignedData();
  }, [selectedPromo]);

  const loadAssignedData = () => {
    // Load Products
    axios.get(`${API_BASE_URL}/api/v1/admin/promotions/${selectedPromo.id}/products`, { headers: createAuthHeaders() })
      .then(res => setAssignedProducts(res.data))
      .catch(console.error);

    // Load Categories
    axios.get(`${API_BASE_URL}/api/v1/admin/promotions/${selectedPromo.id}/categories`, { headers: createAuthHeaders() })
      .then(res => setAssignedCategories(res.data))
      .catch(console.error);
  };

  // --- LOGIC SẢN PHẨM ---
  const openAddProductModal = () => {
      // Load danh sách sản phẩm để chọn (có thể làm pagination/search server-side nếu nhiều)
      axios.get(`${API_BASE_URL}/api/v1/admin/products/search?size=100`, { headers: createAuthHeaders() })
        .then(res => {
            setAllProducts(res.data.content || []);
            setIsProductModalOpen(true);
        });
  };

  const handleAddProduct = async (productId) => {
      try {
          await axios.post(`${API_BASE_URL}/api/v1/admin/promotions/${selectedPromo.id}/products/${productId}`, {}, { headers: createAuthHeaders() });
          toast.success("Đã thêm sản phẩm");
          loadAssignedData(); // Reload
      } catch (e) { toast.error("Lỗi thêm sản phẩm"); }
  };

  // =======================================================
  // SỬA: Logic Xóa Sản phẩm (dùng Modal Custom)
  // =======================================================
  const initiateRemoveProduct = (productId) => {
    setConfirmData({
      isOpen: true,
      title: "Xóa Sản Phẩm Khỏi Khuyến Mãi",
      message: "Bạn có chắc chắn muốn xóa sản phẩm này khỏi chương trình khuyến mãi không?",
      onConfirm: () => confirmRemoveProduct(productId)
    });
  };

  const confirmRemoveProduct = async (productId) => {
      setConfirmData({ ...confirmData, isOpen: false }); // Đóng modal
      try {
          await axios.delete(`${API_BASE_URL}/api/v1/admin/promotions/${selectedPromo.id}/products/${productId}`, { headers: createAuthHeaders() });
          toast.success("Đã xóa sản phẩm");
          loadAssignedData();
      } catch (e) { toast.error("Lỗi xóa sản phẩm"); }
  };
  // =======================================================

  // --- LOGIC DANH MỤC ---
  const openAddCategoryModal = () => {
      axios.get(`${API_BASE_URL}/api/v1/categories/all`, { headers: createAuthHeaders() })
        .then(res => {
            // Flatten categories nếu cần, hoặc lấy list phẳng
            const list = Array.isArray(res.data) ? res.data : (res.data.content || []);
            setAllCategories(list);
            setIsCategoryModalOpen(true);
        });
  };

  const handleAddCategory = async (catId) => {
      try {
          await axios.post(`${API_BASE_URL}/api/v1/admin/promotions/${selectedPromo.id}/categories/${catId}`, {}, { headers: createAuthHeaders() });
          toast.success("Đã thêm danh mục");
          loadAssignedData();
      } catch (e) { toast.error("Lỗi thêm danh mục"); }
  };

  // =======================================================
  // SỬA: Logic Xóa Danh mục (dùng Modal Custom)
  // =======================================================
  const initiateRemoveCategory = (catId) => {
    setConfirmData({
      isOpen: true,
      title: "Xóa Danh Mục Khỏi Khuyến Mãi",
      message: "Bạn có chắc chắn muốn xóa danh mục này khỏi chương trình khuyến mãi không?",
      onConfirm: () => confirmRemoveCategory(catId)
    });
  };

  const confirmRemoveCategory = async (catId) => {
      setConfirmData({ ...confirmData, isOpen: false }); // Đóng modal
      try {
          await axios.delete(`${API_BASE_URL}/api/v1/admin/promotions/${selectedPromo.id}/categories/${catId}`, { headers: createAuthHeaders() });
          toast.success("Đã xóa danh mục");
          loadAssignedData();
      } catch (e) { toast.error("Lỗi xóa danh mục"); }
  };
  // =======================================================

  // Style
  const styles = `
    .ppm-container { padding: 20px; display: grid; grid-template-columns: 300px 1fr; gap: 20px; font-family: sans-serif; background: #f4f7fa; min-height: 100vh; }
    .panel { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); height: fit-content; }
    .panel h3 { margin-top: 0; border-bottom: 1px solid #eee; padding-bottom: 10px; font-size: 16px; color: #444; }
    
    /* Promo List */
    .promo-item { padding: 10px; border-bottom: 1px solid #f0f0f0; cursor: pointer; transition: background 0.2s; }
    .promo-item:hover { background: #f8f9fa; }
    .promo-item.active { background: #e6f7ff; border-left: 3px solid #1890ff; }
    .promo-name { font-weight: bold; font-size: 14px; }
    .promo-code { font-size: 12px; color: #666; background: #eee; padding: 2px 5px; border-radius: 4px; }
    
    /* Tabs */
    .tabs { display: flex; border-bottom: 1px solid #ddd; margin-bottom: 20px; }
    .tab { padding: 10px 20px; cursor: pointer; font-weight: 600; color: #666; border-bottom: 2px solid transparent; }
    .tab.active { color: #1890ff; border-bottom-color: #1890ff; }
    
    /* Table */
    .data-table { width: 100%; border-collapse: collapse; font-size: 14px; }
    .data-table th { text-align: left; padding: 10px; background: #f9f9f9; border-bottom: 1px solid #eee; }
    .data-table td { padding: 10px; border-bottom: 1px solid #eee; }
    .btn-icon { background: none; border: none; cursor: pointer; color: #ff4d4f; font-size: 16px; }
    
    .btn-add { background: #28a745; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; float: right; font-size: 13px; display: flex; align-items: center; gap: 5px; }

    /* Modal Thêm SP/Danh mục */
    .modal-overlay { position: fixed; top:0; left:0; right:0; bottom:0; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; }
    .modal-content { background: white; width: 500px; max-height: 80vh; padding: 20px; border-radius: 8px; overflow-y: auto; }
    .modal-list-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #eee; }
    .modal-btn-add { background: #e6f7ff; color: #1890ff; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; }
    .modal-close { float: right; background: none; border: none; font-size: 20px; cursor: pointer; }

    /* MODAL XÁC NHẬN (CUSTOM) */
    .confirm-modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); z-index: 10000; display: flex; justify-content: center; align-items: center; animation: fadeIn 0.2s; }
    .confirm-modal-box { background: white; padding: 25px; border-radius: 8px; width: 90%; max-width: 400px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); }
    .confirm-modal-header { display: flex; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
    .confirm-modal-header h3 { margin: 0; font-size: 1.2rem; color: #333; margin-left: 10px; }
    .warning-icon { color: #dc3545; font-size: 1.5rem; }
    .confirm-modal-body p { color: #555; line-height: 1.5; }
    .confirm-modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
    .confirm-modal-actions button { padding: 8px 16px; border-radius: 4px; border: none; font-weight: 600; cursor: pointer; }
    .confirm-modal-actions .btn-secondary { background: #eee; color: #333; }
    .confirm-modal-actions .btn-danger { background: #dc3545; color: white; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `;

  return (
    <>
      <style>{styles}</style>
      
      {/* Modal Xác Nhận Chung */}
      <ConfirmationModal
        isOpen={confirmData.isOpen}
        onClose={() => setConfirmData({ ...confirmData, isOpen: false })}
        onConfirm={confirmData.onConfirm}
        title={confirmData.title}
        message={confirmData.message}
      />

      <div className="ppm-container">
        
        {/* LEFT: LIST PROMOTIONS */}
        <div className="panel">
            <h3>Danh sách Khuyến mãi</h3>
            <div style={{maxHeight: '70vh', overflowY: 'auto'}}>
                {promotions.map(p => (
                    <div 
                        key={p.id} 
                        className={`promo-item ${selectedPromo?.id === p.id ? 'active' : ''}`}
                        onClick={() => setSelectedPromo(p)}
                    >
                        <div className="promo-name">{p.name}</div>
                        {p.code && <span className="promo-code">{p.code}</span>}
                        <div style={{fontSize: 12, color: p.active ? 'green' : 'red', marginTop: 4}}>
                            {p.active ? '● Đang chạy' : '● Tạm dừng'}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* RIGHT: DETAILS */}
        <div className="panel">
            {!selectedPromo ? (
                <div style={{textAlign:'center', color:'#888', padding: 50}}>Vui lòng chọn một chương trình khuyến mãi bên trái</div>
            ) : (
                <>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 10}}>
                        <h2 style={{margin:0}}>{selectedPromo.name}</h2>
                        <span style={{fontSize: 18, fontWeight: 'bold', color: '#d32f2f'}}>
                            {selectedPromo.type === 'PERCENTAGE' ? `Giảm ${selectedPromo.value}%` : `Giảm ${selectedPromo.value.toLocaleString()}đ`}
                        </span>
                    </div>

                    <div className="tabs">
                        <div className={`tab ${activeTab === 'PRODUCTS' ? 'active' : ''}`} onClick={() => setActiveTab('PRODUCTS')}>Sản phẩm áp dụng</div>
                        <div className={`tab ${activeTab === 'CATEGORIES' ? 'active' : ''}`} onClick={() => setActiveTab('CATEGORIES')}>Danh mục áp dụng</div>
                    </div>

                    {activeTab === 'PRODUCTS' && (
                        <div>
                            <button className="btn-add" onClick={openAddProductModal}>{faPlus} Thêm Sản phẩm</button>
                            <div style={{clear:'both', marginBottom: 10}}></div>
                            <table className="data-table">
                                <thead><tr><th>ID</th><th>Ảnh</th><th>Tên sản phẩm</th><th>Hành động</th></tr></thead>
                                <tbody>
                                    {assignedProducts.length === 0 ? <tr><td colSpan="4">Chưa có sản phẩm nào.</td></tr> : 
                                        assignedProducts.map(p => (
                                            <tr key={p.id}>
                                                <td>{p.id}</td>
                                                <td><img src={p.thumbnail} alt="" style={{width:40, height:40, objectFit:'cover', borderRadius:4}}/></td>
                                                <td>{p.productName}</td>
                                                <td>
                                                    {/* SỬA: Gọi hàm mở modal xác nhận */}
                                                    <button className="btn-icon" onClick={() => initiateRemoveProduct(p.id)}>{faTrash}</button>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'CATEGORIES' && (
                        <div>
                             <button className="btn-add" onClick={openAddCategoryModal}>{faPlus} Thêm Danh mục</button>
                             <div style={{clear:'both', marginBottom: 10}}></div>
                             <table className="data-table">
                                <thead><tr><th>ID</th><th>Tên danh mục</th><th>Hành động</th></tr></thead>
                                <tbody>
                                    {assignedCategories.length === 0 ? <tr><td colSpan="3">Chưa có danh mục nào.</td></tr> : 
                                        assignedCategories.map(c => (
                                            <tr key={c.id}>
                                                <td>{c.id}</td>
                                                <td>{c.name}</td>
                                                <td>
                                                    {/* SỬA: Gọi hàm mở modal xác nhận */}
                                                    <button className="btn-icon" onClick={() => initiateRemoveCategory(c.id)}>{faTrash}</button>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                             </table>
                        </div>
                    )}
                </>
            )}
        </div>
      </div>

      {/* MODAL THÊM SẢN PHẨM */}
      {isProductModalOpen && (
          <div className="modal-overlay" onClick={() => setIsProductModalOpen(false)}>
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                  <div style={{marginBottom: 15}}>
                      <button className="modal-close" onClick={() => setIsProductModalOpen(false)}>×</button>
                      <h3>Chọn sản phẩm để thêm</h3>
                      <input 
                        style={{width:'100%', padding: 8, border: '1px solid #ddd', borderRadius: 4}} 
                        placeholder="Tìm tên sản phẩm..." 
                        value={productSearch}
                        onChange={e => setProductSearch(e.target.value)}
                      />
                  </div>
                  <div>
                      {allProducts
                        .filter(p => p.productName.toLowerCase().includes(productSearch.toLowerCase()))
                        .map(p => {
                            const isAssigned = assignedProducts.some(ap => ap.id === p.id);
                            return (
                                <div key={p.id} className="modal-list-item">
                                    <div style={{display:'flex', alignItems:'center', gap: 10}}>
                                        <img src={p.thumbnail} alt="" style={{width:30, height:30}} />
                                        <span>{p.productName}</span>
                                    </div>
                                    {isAssigned ? (
                                        <span style={{color:'green', fontSize:12}}>{faCheck} Đã thêm</span>
                                    ) : (
                                        <button className="modal-btn-add" onClick={() => handleAddProduct(p.id)}>Thêm</button>
                                    )}
                                </div>
                            );
                        })}
                  </div>
              </div>
          </div>
      )}

      {/* MODAL THÊM DANH MỤC */}
      {isCategoryModalOpen && (
          <div className="modal-overlay" onClick={() => setIsCategoryModalOpen(false)}>
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                  <div>
                      <button className="modal-close" onClick={() => setIsCategoryModalOpen(false)}>×</button>
                      <h3>Chọn danh mục để thêm</h3>
                  </div>
                  {allCategories.map(c => {
                      const isAssigned = assignedCategories.some(ac => ac.id === c.id);
                      return (
                        <div key={c.id} className="modal-list-item">
                            <span>{c.name}</span>
                            {isAssigned ? (
                                <span style={{color:'green', fontSize:12}}>{faCheck} Đã thêm</span>
                            ) : (
                                <button className="modal-btn-add" onClick={() => handleAddCategory(c.id)}>Thêm</button>
                            )}
                        </div>
                      );
                  })}
              </div>
          </div>
      )}
    </>
  );
}
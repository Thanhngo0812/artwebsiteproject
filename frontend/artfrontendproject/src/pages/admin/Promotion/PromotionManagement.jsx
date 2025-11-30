import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate'; 

const API_BASE_URL = "https://deployforstudy-1.onrender.com";

// --- HELPER ---
const StyleInjector = ({ styles }) => {
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
    return () => document.head.removeChild(styleElement);
  }, [styles]);
  return null;
};

const LoadingSpinner = ({ isLoading }) => {
  if (!isLoading) return null;
  return (
    <div className="loading-overlay">
      <div className="loading-spinner"></div>
    </div>
  );
};

// Icons
const faEdit = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor"><path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9L489.4 100c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.8 15.8-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h144c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"/></svg>;
const faTrash = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="1em" height="1em" fill="currentColor"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>;
const faPlus = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="1em" height="1em" fill="currentColor"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>;
const faTimes = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="1em" height="1em" fill="currentColor"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>;

// Helpers
const getAuthToken = () => localStorage.getItem('user');
const createAuthHeaders = () => {
    const token = getAuthToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};
const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('vi-VN') : '';

export default function PromotionManagement() {
  const [promotions, setPromotions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null); // Nếu null là Thêm mới, có data là Sửa

  // Form Data
  const [formData, setFormData] = useState({
      name: '',
      description: '',
      code: '', // Nếu rỗng là Sale tự động
      type: 'PERCENTAGE', // hoặc FIXED_AMOUNT
      value: '',
      startDate: '',
      endDate: '',
      minOrderValue: '',
      maxDiscountValue: '',
      usageLimit: '',
      active: true,
      imageUrl: '' // Ảnh Banner
  });

  useEffect(() => { fetchPromotions(); }, [currentPage]);

  const fetchPromotions = async () => {
      setIsLoading(true);
      try {
          const response = await axios.get(`${API_BASE_URL}/api/v1/admin/promotions`, {
              headers: createAuthHeaders(),
              params: { page: currentPage, size: 10 }
          });
          console.log(response.data)
          setPromotions(response.data.content);
          setTotalPages(response.data.totalPages);
      } catch (error) {
          toast.error("Lỗi tải danh sách khuyến mãi.");
      } finally { setIsLoading(false); }
  };

  // --- HANDLERS ---

  const handleOpenModal = (promo = null) => {
      if (promo) {
          // Edit Mode: Fill data
          setEditingPromo(promo);
          setFormData({
              name: promo.name,
              description: promo.description || '',
              code: promo.code || '',
              type: promo.type,
              value: promo.value,
              startDate: promo.startDate ? promo.startDate.split('T')[0] : '',
              endDate: promo.endDate ? promo.endDate.split('T')[0] : '',
              minOrderValue: promo.minOrderValue || '',
              maxDiscountValue: promo.maxDiscountValue || '',
              usageLimit: promo.usageLimit || '',
              active: promo.active,
              imageUrl: promo.imageUrl || ''
          });
      } else {
          // Create Mode: Reset form
          setEditingPromo(null);
          setFormData({
              name: '', description: '', code: '', type: 'PERCENTAGE', value: '',
              startDate: '', endDate: '', minOrderValue: '0', maxDiscountValue: '',
              usageLimit: '', active: true, imageUrl: ''
          });
      }
      setIsModalOpen(true);
  };

  const handleCloseModal = () => {
      setIsModalOpen(false);
      setEditingPromo(null);
  };

  const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData(prev => ({
          ...prev,
          [name]: type === 'checkbox' ? checked : value
      }));
  };

  // Upload Ảnh Banner
  const handleImageUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      // (Giả sử bạn muốn show loading riêng cho upload, ở đây dùng chung isLoading)
      try {
          const uploadData = new FormData();
          uploadData.append("file", file);
          
          // Gọi API Upload đã có
          const response = await axios.post(`${API_BASE_URL}/api/v1/files/upload`, uploadData, {
              headers: { ...createAuthHeaders(), 'Content-Type': 'multipart/form-data' }
          });
          
          setFormData(prev => ({ ...prev, imageUrl: response.data.url }));
          toast.success("Upload ảnh thành công!");
      } catch (error) {
          toast.error("Lỗi upload ảnh.");
      }
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      if (!formData.name || !formData.value || !formData.startDate || !formData.endDate) {
          toast.error("Vui lòng điền các trường bắt buộc (*)");
          return;
      }

      setIsLoading(true);
      try {
          const payload = { ...formData };
          // Convert số
          payload.value = parseFloat(payload.value);
          if (payload.minOrderValue) payload.minOrderValue = parseFloat(payload.minOrderValue);
          if (payload.maxDiscountValue) payload.maxDiscountValue = parseFloat(payload.maxDiscountValue);
          if (payload.usageLimit) payload.usageLimit = parseInt(payload.usageLimit);
          payload.endDate=payload.endDate+"T00:00:00";
          payload.startDate=payload.startDate+"T00:00:00";

          if (editingPromo) {
              // UPDATE
              await axios.put(`${API_BASE_URL}/api/v1/admin/promotions/${editingPromo.id}`, payload, {
                  headers: createAuthHeaders()
              });
              toast.success("Cập nhật thành công!");
          } else {
              // CREATE
              await axios.post(`${API_BASE_URL}/api/v1/admin/promotions`, payload, {
                  headers: createAuthHeaders()
              });
              toast.success("Tạo mới thành công!");
          }
          handleCloseModal();
          fetchPromotions();
      } catch (error) {
          toast.error(error.response?.data?.message || "Lỗi lưu dữ liệu.");
      } finally { setIsLoading(false); }
  };

  const handleDelete = async (id) => {
      if (!window.confirm("Bạn chắc chắn muốn xóa khuyến mãi này?")) return;
      try {
          await axios.delete(`${API_BASE_URL}/api/v1/admin/promotions/${id}`, { headers: createAuthHeaders() });
          toast.success("Đã xóa.");
          fetchPromotions();
      } catch (error) {
          toast.error("Xóa thất bại.");
      }
  };

  // --- CSS ---
  const allStyles = `
    .promo-container { padding: 20px; background: #f4f7fa; min-height: 100vh; font-family: sans-serif; }
    .promo-card { background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px;}
    .page-title { font-size: 24px; font-weight: 600; color: #333; margin: 0; }
    
    .btn-create { background: #28a745; color: white; border: none; padding: 10px 20px; border-radius: 5px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; }
    .btn-icon { background: none; border: none; cursor: pointer; font-size: 18px; margin-right: 10px; }
    .text-primary { color: #007bff; } .text-danger { color: #dc3545; }

    .promo-table { width: 100%; border-collapse: collapse; font-size: 14px; }
    .promo-table th { background: #f8f9fa; padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6; }
    .promo-table td { padding: 12px; border-bottom: 1px solid #eee; vertical-align: middle; }
    
    .status-active { color: #28a745; font-weight: bold; }
    .status-inactive { color: #dc3545; font-weight: bold; }
    
    /* Modal */
    .modal-overlay { position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; justify-content: center; align-items: center; }
    .modal-box { background: #fff; width: 90%; max-width: 800px; max-height: 90vh; border-radius: 8px; overflow-y: auto; position: relative; display: flex; flex-direction: column; }
    .modal-header { padding: 20px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; }
    .modal-title { font-size: 18px; font-weight: bold; margin: 0; }
    .modal-close { background: none; border: none; font-size: 24px; cursor: pointer; color: #666; }
    .modal-body { padding: 20px; }
    .modal-footer { padding: 20px; border-top: 1px solid #eee; display: flex; justify-content: flex-end; gap: 10px; }

    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .form-group { margin-bottom: 15px; }
    .form-label { display: block; font-weight: 600; margin-bottom: 5px; color: #555; font-size: 13px; }
    .form-input, .form-select { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
    .form-textarea { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; min-height: 80px; resize: vertical; }
    
    .image-preview { margin-top: 10px; width: 100%; max-height: 150px; object-fit: contain; border: 1px solid #eee; }
    
    .btn-save { background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: 600; }
    .btn-cancel { background: #fff; border: 1px solid #ccc; color: #333; padding: 10px 20px; border-radius: 5px; cursor: pointer; }

    .loading-overlay { position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(255,255,255,0.7); display: flex; justify-content: center; align-items: center; z-index: 9999; }
    .loading-spinner { width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #007bff; border-radius: 50%; animation: spin 1s linear infinite; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    
    /* Pagination */
    .pagination { display: flex; list-style: none; gap: 5px; padding: 0; justify-content: flex-end; margin-top: 20px; }
    .pagination li a { padding: 6px 12px; border: 1px solid #ddd; cursor: pointer; border-radius: 4px; }
    .pagination li.active a { background: #007bff; color: white; border-color: #007bff; }
  `;

  return (
    <>
      <StyleInjector styles={allStyles} />
      <LoadingSpinner isLoading={isLoading} />

      <div className="promo-container">
        <div className="promo-card">
          <div className="page-header">
            <h2 className="page-title">Quản lý Khuyến mãi</h2>
            <button className="btn-create" onClick={() => handleOpenModal()}>
                {faPlus} Thêm Mới
            </button>
          </div>

          <table className="promo-table">
             <thead>
                 <tr>
                     <th>ID</th>
                     <th>Tên</th>
                     <th>Mã Code</th>
                     <th>Loại</th>
                     <th>Giá trị</th>
                     <th>Thời gian</th>
                     <th>Trạng thái</th>
                     <th>Thao tác</th>
                 </tr>
             </thead>
             <tbody>
                 {promotions.map(p => (
                     <tr key={p.id}>
                         <td>#{p.id}</td>
                         <td>
                            {p.imageUrl && <img src={p.imageUrl} alt="" style={{width:30, height:30, objectFit:'cover', borderRadius:'50%', marginRight:5, verticalAlign:'middle'}} />}
                            {p.name}
                         </td>
                         <td>{p.code ? <span style={{background:'#eee', padding:'2px 6px', borderRadius:4, fontWeight:'bold'}}>{p.code}</span> : <span style={{fontStyle:'italic', color:'#888'}}>Tự động</span>}</td>
                         <td>{p.type === 'PERCENTAGE' ? 'Phần trăm' : 'Tiền mặt'}</td>
                         <td style={{color:'#d32f2f', fontWeight:'bold'}}>
                             {p.type === 'PERCENTAGE' ? `${p.value}%` : formatCurrency(p.value)}
                         </td>
                         <td>
                             <small>{formatDate(p.startDate)}</small><br/>
                             <small>➝ {formatDate(p.endDate)}</small>
                         </td>
                         <td>
                             {p.active ? <span className="status-active">Đang chạy</span> : <span className="status-inactive">Tạm dừng</span>}
                         </td>
                         <td>
                             <button className="btn-icon text-primary" onClick={() => handleOpenModal(p)} title="Sửa">{faEdit}</button>
                             <button className="btn-icon text-danger" onClick={() => handleDelete(p.id)} title="Xóa">{faTrash}</button>
                         </td>
                     </tr>
                 ))}
             </tbody>
          </table>

          {totalPages > 1 && <ReactPaginate pageCount={totalPages} onPageChange={(e)=>setCurrentPage(e.selected)} containerClassName="pagination" activeClassName="active" />}
        </div>

        {/* MODAL FORM */}
        {isModalOpen && (
            <div className="modal-overlay" onClick={handleCloseModal}>
                <div className="modal-box" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <h3 className="modal-title">{editingPromo ? "Cập nhật Khuyến mãi" : "Thêm mới Khuyến mãi"}</h3>
                        <button className="modal-close" onClick={handleCloseModal}>{faTimes}</button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">Tên chương trình (*)</label>
                                    <input className="form-input" name="name" value={formData.name} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Mã Code (Để trống nếu tự động)</label>
                                    <input className="form-input" name="code" value={formData.code} onChange={handleChange} placeholder="VD: SALE50" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Loại giảm giá (*)</label>
                                    <select className="form-select" name="type" value={formData.type} onChange={handleChange}>
                                        <option value="PERCENTAGE">Phần trăm (%)</option>
                                        <option value="FIXED_AMOUNT">Số tiền cố định (VNĐ)</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Giá trị giảm (*)</label>
                                    <input type="number" className="form-input" name="value" value={formData.value} onChange={handleChange} required placeholder="VD: 20 hoặc 50000" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Ngày bắt đầu (*)</label>
                                    <input type="date" className="form-input" name="startDate" value={formData.startDate} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Ngày kết thúc (*)</label>
                                    <input type="date" className="form-input" name="endDate" value={formData.endDate} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Đơn hàng tối thiểu</label>
                                    <input type="number" className="form-input" name="minOrderValue" value={formData.minOrderValue} onChange={handleChange} placeholder="VD: 200000" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Giảm tối đa (Cho %)</label>
                                    <input type="number" className="form-input" name="maxDiscountValue" value={(formData.type !== 'PERCENTAGE')?'':formData.maxDiscountValue} onChange={handleChange} placeholder="VD: 50000" disabled={formData.type !== 'PERCENTAGE'} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Giới hạn lượt dùng</label>
                                    <input type="number" className="form-input" name="usageLimit" value={formData.usageLimit} onChange={handleChange} placeholder="VD: 100" disabled={formData.code == ''}/>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Trạng thái</label>
                                    <div style={{marginTop:5}}>
                                        <label style={{cursor:'pointer', display:'flex', alignItems:'center'}}>
                                            <input style={{width:'5%'}} type="checkbox" name="active" checked={formData.active} onChange={handleChange}/>
                                            Kích hoạt
                                        </label>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label className="form-label">Mô tả</label>
                                <textarea className="form-textarea" name="description" value={formData.description} onChange={handleChange}></textarea>
                            </div>

                            {/* UPLOAD ẢNH */}
                            <div className="form-group">
                                <label className="form-label">Ảnh Banner (Tùy chọn)</label>
                                <input type="file" onChange={handleImageUpload} accept="image/*" />
                                {formData.imageUrl && <img src={formData.imageUrl} alt="Preview" className="image-preview" />}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn-cancel" onClick={handleCloseModal}>Hủy</button>
                            <button type="submit" className="btn-save">Lưu lại</button>
                        </div>
                    </form>
                </div>
            </div>
        )}
      </div>
    </>
  );
}
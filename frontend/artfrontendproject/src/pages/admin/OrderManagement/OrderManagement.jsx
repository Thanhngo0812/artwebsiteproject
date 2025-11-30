import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

// MOCK: ReactPaginate (Để chạy được trên preview, bạn hãy bỏ comment import thật khi dùng)
// import ReactPaginate from 'react-paginate';
const ReactPaginate = ({ onPageChange, pageCount, forcePage }) => (
  <div className='pagination' style={{display:'flex', gap:5, justifyContent:'center', marginTop:20}}>
    <button disabled={forcePage===0} onClick={()=>onPageChange({selected:forcePage-1})}>Trước</button>
    <span style={{height:'70%',marginTop:'5px'}}>Page {forcePage+1} of {pageCount}</span>
    <button disabled={forcePage===pageCount-1} onClick={()=>onPageChange({selected:forcePage+1})}>Sau</button>
  </div>
);

// API URL & KEY
const API_BASE_URL = "https://deployforstudy-1.onrender.com";
const TOMTOM_API_KEY = process.env.REACT_APP_TOMTOM_API_KEY;

// --- COMPONENT TỰ CHỨA (ICONS, STYLE) ---
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

// Icons SVG
const faEye = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="1em" height="1em" fill="currentColor"><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/></svg>;
const faTimes = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="1em" height="1em" fill="currentColor"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>;
const faWarning = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor"><path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40C25.7 480 13.7 467.1 13.4 452s7-27.7 14.3-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/></svg>;

// Helpers
const getAuthToken = () => localStorage.getItem('accessToken');
const createAuthHeaders = () => {
    const token = getAuthToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};
const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
const formatDate = (dateStr) => new Date(dateStr).toLocaleString('vi-VN');

// =======================================================
// MODAL XÁC NHẬN CUSTOM
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
        <div className="confirm-modal-body"><p>{message}</p></div>
        <div className="confirm-modal-actions">
          <button className="btn-secondary" onClick={onClose}>Hủy</button>
          <button className="btn-danger" onClick={onConfirm}>Xác nhận</button>
        </div>
      </div>
    </div>
  );
};

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Filter state
  const [filter, setFilter] = useState({
      status: '',
      keyword: '',
      startDate: '',
      endDate: ''
  });

  // Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // State cho Modal Xác nhận
  const [confirmData, setConfirmData] = useState({ isOpen: false, orderId: null, newStatus: null });

  // TomTom Map
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [isSdkLoaded, setIsSdkLoaded] = useState(!!(window.tt && window.tt.services));

  // Load TomTom SDK
  useEffect(() => {
    if (isSdkLoaded) return;
    const loadSDK = () => {
      const cssLink = document.createElement('link');
      cssLink.rel = 'stylesheet';
      cssLink.href = 'https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.25.0/maps/maps.css';
      cssLink.id = 'tomtom-maps-css';
      document.head.appendChild(cssLink);
      const mapScript = document.createElement('script');
      mapScript.src = 'https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.25.0/maps/maps-web.min.js';
      mapScript.async = true;
      mapScript.onload = () => setIsSdkLoaded(true);
      document.body.appendChild(mapScript);
    };
    if (!window.tt) loadSDK(); else setIsSdkLoaded(true);
  }, [isSdkLoaded]);

  // Fetch Orders
  const fetchOrders = async () => {
      setIsLoading(true);
      try {
          const params = {
              page: currentPage,
              size: 10,
              status: filter.status || null,
              keyword: filter.keyword || null,
              startDate: filter.startDate || null,
              endDate: filter.endDate || null
          };
          const response = await axios.get(`${API_BASE_URL}/api/v1/admin/orders`, {
              headers: createAuthHeaders(), params
          });
          setOrders(response.data.content);
          setTotalPages(response.data.totalPages);
      } catch (error) {
          toast.error("Lỗi tải danh sách đơn hàng.");
      } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [currentPage, filter]); 

  // --- LOGIC CẬP NHẬT TRẠNG THÁI ---
  
  // 1. Mở modal xác nhận
  const initiateStatusUpdate = (orderId, newStatus) => {
      // Ngăn cập nhật nếu đang xem modal mà bấm nhầm
      if(selectedOrder && selectedOrder.id !== orderId) return; 
      setConfirmData({ isOpen: true, orderId, newStatus });
  };

  // 2. Gọi API
  const handleConfirmUpdate = async () => {
      const { orderId, newStatus } = confirmData;
      setConfirmData({ ...confirmData, isOpen: false }); // Đóng modal
      
      setIsLoading(true);
      try {
          await axios.put(`${API_BASE_URL}/api/v1/admin/orders/${orderId}/status`, 
             { status: newStatus }, 
             { headers: createAuthHeaders() }
          );
          toast.success(`Cập nhật thành công: ${newStatus}`);
          fetchOrders(); 
          
          // Nếu đang mở modal chi tiết của đơn hàng này, cập nhật luôn UI modal
          if(selectedOrder && selectedOrder.id === orderId) {
              setSelectedOrder(prev => ({...prev, orderStatus: newStatus}));
          }
      } catch (error) {
          toast.error(error.response?.data?.message || "Lỗi cập nhật.");
      } finally { setIsLoading(false); }
  };

  // Map Logic (Trong Modal Detail)
  useEffect(() => {
      if (selectedOrder && isSdkLoaded && mapContainerRef.current) {
          if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; }
          
          if (selectedOrder.latitude && selectedOrder.longitude) {
              const coords = [selectedOrder.longitude, selectedOrder.latitude];
              const map = window.tt.map({
                  key: TOMTOM_API_KEY, container: mapContainerRef.current, center: coords, zoom: 15
              });
              const el = document.createElement('div');
              el.className = 'custom-marker';
              new window.tt.Marker({ element: el }).setLngLat(coords).addTo(map);
              mapInstanceRef.current = map;
              setTimeout(() => map.resize(), 300); 
          }
      }
  }, [selectedOrder, isSdkLoaded]);

  // Render Badge
  const getStatusBadge = (status) => {
      const cls = {
          'PENDING': 'bg-warning', 'APPROVED': 'bg-info', 
          'SHIPPED': 'bg-primary', 'DELIVERED': 'bg-success', 
          'CANCELLED': 'bg-danger', 'PAID': 'bg-success'
      }[status] || 'bg-secondary';
      return <span className={`status-badge ${cls}`}>{status}</span>;
  };

  // CSS
  const allStyles = `
    .admin-order-container { padding: 20px; background: #f4f7fa; min-height: 100vh; font-family: sans-serif; }
    .order-card { background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
    .page-title { font-size: 24px; font-weight: 600; margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px;}
    
    .filter-bar { display: flex; gap: 15px; margin-bottom: 20px; flex-wrap: wrap; align-items: flex-end; }
    .filter-item { display: flex; flex-direction: column; gap: 5px; }
    .filter-item label { font-size: 13px; font-weight: 600; color: #666; }
    .filter-input { padding: 8px; border: 1px solid #ddd; border-radius: 4px; min-width: 150px; }
    
    .order-table { width: 100%; border-collapse: collapse; font-size: 14px; }
    .order-table th { background: #f8f9fa; padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6; color: #555; }
    .order-table td { padding: 12px; border-bottom: 1px solid #eee; vertical-align: middle; color: #333; }
    .order-table tr:hover { background: #fcfcfc; }
    
    .status-badge { padding: 4px 8px; border-radius: 4px; color: white; font-size: 11px; font-weight: bold; }
    .bg-warning { background-color: #ffc107; color: #212529; }
    .bg-info { background-color: #17a2b8; }
    .bg-primary { background-color: #007bff; }
    .bg-success { background-color: #28a745; }
    .bg-danger { background-color: #dc3545; }
    .bg-secondary { background-color: #6c757d; }

    .btn-view { background: #e0f0ff; color: #007bff; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-weight: 600; font-size: 13px; display: flex; align-items: center; gap: 5px; }
    .btn-view:hover { background: #007bff; color: white; }
    .pagination button {
    padding: 8px 16px;
    border: 1px solid #dee2e6;
    background: white;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    color: var(--primary-color);
}
    .pagination button:disabled {
    background: #f8f9fa;
    color: #adb5bd;
    cursor: not-allowed;
}
    .pagination { display: flex; list-style: none; gap: 5px; padding: 0; justify-content: flex-end; margin-top: 20px; }
    .pagination li button { padding: 6px 12px; border: 1px solid #ddd; cursor: pointer; border-radius: 4px; background: white; }
    .pagination li button:disabled { background: #f0f0f0; color: #ccc; cursor: not-allowed; }

    /* Modal */
    .modal-overlay { position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; justify-content: center; align-items: center; }
    .modal-box { background: #fff; width: 90%; max-width: 1000px; max-height: 90vh; border-radius: 8px; overflow-y: auto; position: relative; display: flex; flex-direction: column; }
    .modal-close-btn { position: absolute; top: 15px; right: 15px; border: none; background: none; font-size: 20px; cursor: pointer; color: #666; }
    
    .modal-body { padding: 25px; display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
    @media(max-width: 768px) { .modal-body { grid-template-columns: 1fr; } }
    
    .modal-section h3 { font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 15px; }
    .order-item { display: flex; gap: 10px; margin-bottom: 10px; border-bottom: 1px solid #f9f9f9; padding-bottom: 10px; }
    .order-item img { width: 50px; height: 50px; object-fit: cover; border-radius: 4px; }
    .map-view { width: 100%; height: 300px; background: #eee; border-radius: 6px; margin-top: 10px; overflow: hidden; border: 1px solid #ddd; }
    .custom-marker { width: 20px; height: 20px; background: #E74C3C; border: 2px solid #fff; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3); }

    /* Status Control */
    .status-control { margin-top: 20px; background: #f8f9fa; padding: 15px; border-radius: 6px; border: 1px solid #eee; }
    .status-select { width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ccc; }
    
    /* Confirm Modal */
    .confirm-modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); z-index: 10000; display: flex; justify-content: center; align-items: center; animation: fadeIn 0.2s; }
    .confirm-modal-box { background: white; padding: 25px; border-radius: 8px; width: 90%; max-width: 400px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); }
    .confirm-modal-header { display: flex; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
    .confirm-modal-header h3 { margin: 0; font-size: 1.2rem; color: #333; margin-left: 10px; }
    .warning-icon { color: #dc3545; font-size: 1.5rem; }
    .confirm-modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
    .confirm-modal-actions button { padding: 8px 16px; border-radius: 4px; border: none; font-weight: 600; cursor: pointer; }
    .confirm-modal-actions .btn-secondary { background: #eee; color: #333; }
    .confirm-modal-actions .btn-danger { background: #dc3545; color: white; }

    .loading-overlay { position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(255,255,255,0.7); display: flex; justify-content: center; align-items: center; z-index: 9999; }
    .loading-spinner { border: 4px solid #f3f3f3; border-top: 4px solid #007bff; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  `;

  return (
    <>
      <StyleInjector styles={allStyles} />
      <LoadingSpinner isLoading={isLoading} />

      {/* Modal Xác Nhận Chuyển Trạng Thái */}
      <ConfirmationModal
        isOpen={confirmData.isOpen}
        onClose={() => setConfirmData({ ...confirmData, isOpen: false })}
        onConfirm={handleConfirmUpdate}
        title="Xác nhận thay đổi trạng thái"
        message={`Bạn có chắc chắn muốn chuyển trạng thái đơn hàng sang "${confirmData.newStatus}" không?`}
      />

      <div className="admin-order-container">
        <div className="order-card">
          <h2 className="page-title">Quản lý Đơn hàng</h2>
          
          {/* FILTER */}
          <div className="filter-bar">
             <div className="filter-item"><label>Tìm kiếm</label><input className="filter-input" placeholder="Tên, SĐT, Mã đơn..." value={filter.keyword} onChange={e => setFilter({...filter, keyword: e.target.value})} /></div>
             <div className="filter-item"><label>Trạng thái</label>
                <select className="filter-input" value={filter.status} onChange={e => setFilter({...filter, status: e.target.value})}>
                    <option value="">Tất cả</option>
                    <option value="PENDING">PENDING</option>
                     <option value="PAID">PAID</option>                   
                    <option value="APPROVED">APPROVED</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                </select>
             </div>
             <div className="filter-item"><label>Từ ngày</label><input type="date" className="filter-input" value={filter.startDate} onChange={e => setFilter({...filter, startDate: e.target.value})} /></div>
             <div className="filter-item"><label>Đến ngày</label><input type="date" className="filter-input" value={filter.endDate} onChange={e => setFilter({...filter, endDate: e.target.value})} /></div>
             <div className="filter-item"><button className="btn-view" style={{background:'#007bff', color:'white', height:'35px'}} onClick={() => { setCurrentPage(0); fetchOrders(); }}>Lọc</button></div>
          </div>

          {/* TABLE */}
          <table className="order-table">
             <thead><tr><th>ID</th><th>Ngày tạo</th><th>Khách hàng</th><th>Tổng tiền</th><th>Trạng thái</th><th>Thông tin</th></tr></thead>
             <tbody>
                 {orders.map(o => (
                     <tr key={o.id}>
                         <td>#{o.id}</td>
                         <td>{formatDate(o.createdAt)}</td>
                         <td>{o.customerName}<br/><small style={{color:'#777'}}>{o.customerPhone}</small></td>
                         <td style={{color:'#d32f2f', fontWeight:'bold'}}>{formatCurrency(o.totalPrice)}</td>
                         <td>{getStatusBadge(o.orderStatus)}</td>
                         <td><button className="btn-view" onClick={() => setSelectedOrder(o)}>{faEye} Xem</button></td>
                     </tr>
                 ))}
             </tbody>
          </table>
          
          {/* PAGINATION */}
          {totalPages > 1 && <ReactPaginate pageCount={totalPages} forcePage={currentPage} onPageChange={(e)=>setCurrentPage(e.selected)} />}
        </div>

        {/* MODAL CHI TIẾT */}
        {selectedOrder && (
            <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
                <div className="modal-box" onClick={e => e.stopPropagation()}>
                    <button className="modal-close-btn" onClick={() => setSelectedOrder(null)}>{faTimes}</button>
                    <div className="modal-body">
                        {/* LEFT */}
                        <div className="modal-left">
                            <div className="modal-section">
                                <h3>Chi tiết đơn hàng #{selectedOrder.id}</h3>
                                <div className="order-items-list">
                                    {selectedOrder.orderItems?.map((item, idx) => (
                                        <div key={idx} className="order-item">
                                            <img src={item.thumbnail || "https://placehold.co/60"} alt="p" />
                                            <div>
                                                <div style={{fontWeight:'600', fontSize:'14px'}}>{item.productName}</div>
                                                <div style={{fontSize:'13px', color:'#666'}}>Size: {item.dimensions} x {item.quantity}</div>
                                                <div style={{fontWeight:'bold', color:'#007bff'}}>{formatCurrency(item.priceAtPurchase)}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="info-row total"><span>Tổng cộng:</span> <span>{formatCurrency(selectedOrder.totalPrice)}</span></div>
                            </div>
                            {/* Cập nhật trạng thái */}
                            <div className="status-control">
                                <label>Cập nhật trạng thái:</label>
                                <select 
                                style={{marginTop:'15px'}}
                                    className="status-select" 
                                    value={selectedOrder.orderStatus}
                                    onChange={(e) => initiateStatusUpdate(selectedOrder.id, e.target.value)}
                                      disabled={selectedOrder.orderStatus === "CANCELLED"}

                                >
                                    <option value="PENDING">PENDING (Chờ xử lý)</option>
                                       <option value="PAID">PAID (Đã thanh toán)</option>

                                    <option value="APPROVED">APPROVED (Đã duyệt)</option>
                                    <option value="SHIPPED">SHIPPED (Đang giao)</option>
                                    <option value="DELIVERED">DELIVERED (Đã giao)</option>
                                    <option value="CANCELLED" style={{color:'red'}}>CANCELLED (Hủy đơn)</option>
                                </select>
                            </div>
                        </div>
                        {/* RIGHT */}
                        <div className="modal-right">
                            <div className="modal-section">
                                <h3>Thông tin giao hàng</h3>
                                <div className="info-row"><span>Người nhận:</span> <strong>{selectedOrder.customerName}</strong></div>
                                <div className="info-row"><span>SĐT:</span> <strong>{selectedOrder.customerPhone}</strong></div>
                                <div className="info-row"><span>Địa chỉ:</span> <span style={{textAlign:'right', maxWidth:'60%'}}>{selectedOrder.address}</span></div>
                                <div className="info-row"><span>Thanh toán:</span> <strong>{selectedOrder.paymentMethod}</strong></div>
                            </div>
                            <div className="modal-section">
                                <h3>Vị trí (TomTom Map)</h3>
                                {selectedOrder.latitude ? <div ref={mapContainerRef} className="map-view"></div> : <div className="map-view" style={{display:'flex',justifyContent:'center',alignItems:'center',color:'#888'}}>Không có tọa độ</div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>
    </>
  );
}
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Header from '../../components/layout/Header/Header';

// --- URL & KEY ---
const API_BASE_URL = 'http://localhost:8888';
const TOMTOM_API_KEY = process.env.REACT_APP_TOMTOM_API_KEY;

// --- COMPONENT TỰ CHỨA (ICONS & STYLE) ---
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

// Icons giả lập (SVG)
const faEye = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="1em" height="1em" fill="currentColor"><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/></svg>;
const faTimes = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="1em" height="1em" fill="currentColor"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>;
const faWarning = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor"><path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40C25.7 480 13.7 467.1 13.4 452s7-27.7 14.3-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/></svg>;

// =======================================================
// MOCK: ReactPaginate (Để chạy trong môi trường này)
// =======================================================
const ReactPaginate = ({
  breakLabel,
  nextLabel,
  onPageChange,
  pageRangeDisplayed,
  marginPagesDisplayed,
  pageCount,
  previousLabel,
  containerClassName,
  activeClassName,
  forcePage,
}) => {
  // Render một danh sách nút đơn giản
  const pages = [];
  for (let i = 0; i < pageCount; i++) {
    pages.push(i);
  }

  // Giới hạn hiển thị (đơn giản hóa)
  let displayPages = pages;
  if (pages.length > 5) {
      // Logic rút gọn đơn giản để demo
      const start = Math.max(0, forcePage - 2);
      const end = Math.min(pageCount, forcePage + 3);
      displayPages = pages.slice(start, end);
  }

  return (
    <ul className={containerClassName} style={{ display: 'flex', listStyle: 'none', gap: '5px', justifyContent: 'center' }}>
      <li onClick={() => forcePage > 0 && onPageChange({ selected: forcePage - 1 })}>
        <button className="pagination-btn" disabled={forcePage === 0}>{previousLabel}</button>
      </li>
      
      {displayPages.map((page) => (
        <li key={page} className={page === forcePage ? activeClassName : ''}>
          <button
            className={`pagination-btn ${page === forcePage ? 'active' : ''}`}
            onClick={() => onPageChange({ selected: page })}
          >
            {page + 1}
          </button>
        </li>
      ))}
      
      <li onClick={() => forcePage < pageCount - 1 && onPageChange({ selected: forcePage + 1 })}>
        <button className="pagination-btn" disabled={forcePage === pageCount - 1}>{nextLabel}</button>
      </li>
    </ul>
  );
};

// =======================================================
// Component Modal Xác Nhận (Custom)
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
          <button className="btn-danger" onClick={onConfirm}>Xác nhận Hủy</button>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENT CHÍNH ---
export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Pagination & Filter
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [dateFilter, setDateFilter] = useState({ startDate: '', endDate: '' });
  
  // Modal Detail
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // State cho Modal xác nhận
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [isSdkLoaded, setIsSdkLoaded] = useState(!!(window.tt && window.tt.services));

  const navigate = useNavigate();

  // Helper lấy Token
  const getAuthToken = () => localStorage.getItem('user');
  const createAuthHeaders = () => {
      const token = getAuthToken();
      return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  // 1. Load TomTom SDK (Chỉ load 1 lần)
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
      mapScript.id = 'tomtom-maps-js';
      mapScript.onload = () => setIsSdkLoaded(true);
      document.body.appendChild(mapScript);
    };
    if (!window.tt) loadSDK();
    else setIsSdkLoaded(true);
  }, [isSdkLoaded]);


  // 2. Fetch Orders (Khi filter hoặc page thay đổi)
  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
        const headers = createAuthHeaders();
        if (!headers.Authorization) {
            navigate('/login');
            return;
        }
        
        const params = {
            page: currentPage, // ReactPaginate trả về page bắt đầu từ 0
            size: 5,
            startDate: dateFilter.startDate || null,
            endDate: dateFilter.endDate || null
        };

        const response = await axios.get(`${API_BASE_URL}/api/v1/orders/me`, {
            headers, params
        });
        console.log(response.data)
        setOrders(response.data.content);
        setTotalPages(response.data.totalPages);

    } catch (error) {
        console.error("Lỗi tải đơn hàng:", error);
        toast.error("Không thể tải lịch sử đơn hàng.");
    } finally {
        setIsLoading(false);
    }
  }, [currentPage, dateFilter, navigate]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // --- HỦY ĐƠN HÀNG ---
  const handleOpenCancelModal = () => {
    if (!selectedOrder) return;
    setOrderToCancel(selectedOrder);
    setIsConfirmOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!orderToCancel) return;

    setIsLoading(true);
    setIsConfirmOpen(false);

    try {
        const headers = createAuthHeaders();
        await axios.put(
            `${API_BASE_URL}/api/v1/orders/${orderToCancel.id}/cancel-by-user`, 
            {}, 
            { headers }
        );

        toast.success("Đã hủy đơn hàng thành công.");
        
        // Đóng modal chi tiết và tải lại danh sách
        setSelectedOrder(null);
        fetchOrders();

    } catch (error) {
        console.error("Lỗi hủy đơn:", error);
        const errorMsg = error.response?.data?.message || "Không thể hủy đơn hàng.";
        toast.error(errorMsg);
    } finally {
        setIsLoading(false);
        setOrderToCancel(null);
    }
  };

  // 3. Xử lý Map trong Modal
  useEffect(() => {
    if (selectedOrder && isSdkLoaded && mapContainerRef.current) {
        
        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
        }

        if (selectedOrder.latitude && selectedOrder.longitude) {
            const coords = [selectedOrder.longitude, selectedOrder.latitude];
            
            const map = window.tt.map({
                key: TOMTOM_API_KEY,
                container: mapContainerRef.current,
                center: coords,
                zoom: 15
            });

            const markerEl = document.createElement('div');
            markerEl.className = 'custom-marker';
            
            new window.tt.Marker({ element: markerEl })
                .setLngLat(coords)
                .addTo(map);
            
            mapInstanceRef.current = map;

            const resizeObserver = new ResizeObserver(() => {
                map.resize();
            });
            resizeObserver.observe(mapContainerRef.current);
        }
    }
  }, [selectedOrder, isSdkLoaded]);


  // --- Handlers ---
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setDateFilter(prev => ({ ...prev, [name]: value }));
    setCurrentPage(0); 
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('vi-VN') + ' ' + new Date(dateStr).toLocaleTimeString('vi-VN');

  const getStatusBadge = (status) => {
      const map = {
          'PENDING': { class: 'status-pending', label: 'Chờ xử lý' },
          'PAID': { class: 'status-success', label: 'Đã thanh toán' },
          'CANCELLED': { class: 'status-danger', label: 'Đã hủy' },
          'DELIVERED': { class: 'status-success', label: 'Đã giao' }
      };
      const s = map[status] || { class: 'status-default', label: status };
      return <span className={`status-badge ${s.class}`}>{s.label}</span>;
  };

  // --- CSS ---
  const allStyles = `
    .order-history-container {
        max-width: 1200px; margin: 40px auto; padding: 20px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .page-title { font-size: 2rem; font-weight: 700; margin-bottom: 20px; color: #333; }
    
    /* Filter Section */
    .filter-section {
        display: flex; gap: 15px; margin-bottom: 20px; background: #fff; 
        padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); 
        align-items: flex-end;
    }
    .filter-group { display: flex; flex-direction: column; gap: 5px; }
    .filter-group label { font-size: 0.9rem; font-weight: 600; color: #555; }
    .filter-input { padding: 8px 12px; border: 1px solid #ddd; border-radius: 6px; }
    
    /* Table */
    .table-container { background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); overflow-x: auto; }
    .order-table { width: 100%; border-collapse: collapse; }
    .order-table th { background: #f8f9fa; padding: 15px; text-align: left; font-weight: 600; color: #555; border-bottom: 2px solid #eee; }
    .order-table td { padding: 15px; border-bottom: 1px solid #eee; color: #333; }
    .order-table tr:hover { background: #fcfcfc; }
    
    .btn-view { background: none; border: 1px solid #007bff; color: #007bff; padding: 6px 12px; border-radius: 4px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 5px; }
    .btn-view:hover { background: #007bff; color: #fff; }

    /* Status Badges */
    .status-badge { padding: 4px 10px; border-radius: 12px; font-size: 0.8rem; font-weight: 600; }
    .status-pending { background: #fff3cd; color: #856404; }
    .status-success { background: #d4edda; color: #155724; }
    .status-danger { background: #f8d7da; color: #721c24; }
    .status-default { background: #e2e3e5; color: #383d41; }

    /* Pagination (Style cho ReactPaginate Mock) */
    .pagination-btn {
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 4px;
        cursor: pointer;
        background-color: white;
        color: black;
        transition: all 0.2s;
    }
    .pagination-btn.active {
        background-color: black;
        color: white;
        border-color: white;
    }
    .pagination-btn:hover:not(:disabled) {
        background-color: #e9ecef;
        color:black
    }
    .pagination-btn:disabled {
        color: #ccc;
        cursor: not-allowed;
        background-color: #f8f9fa;
    }

    /* MODAL CHI TIẾT */
    .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; justify-content: center; align-items: center; }
    .modal-content { background: #fff; width: 90%; max-width: 900px; max-height: 90vh; border-radius: 12px; overflow-y: auto; position: relative; display: grid; grid-template-columns: 1fr; }
    @media(min-width: 768px) { .modal-content { grid-template-columns: 1fr 1fr; } }
    
    .modal-close { position: absolute; top: 15px; right: 15px; background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #555; z-index: 10; }
    .modal-left { padding: 25px; border-right: 1px solid #eee; }
    .modal-right { padding: 25px; background: #f9f9f9; }
    .modal-header { border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 15px; }
    .modal-header h3 { margin: 0; font-size: 1.5rem; color: #333; }
    
    .order-item-detail { display: flex; gap: 15px; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #f0f0f0; }
    .order-item-detail img { width: 60px; height: 60px; object-fit: cover; border-radius: 4px; }
    
    .map-container-modal { width: 100%; height: 300px; border-radius: 8px; overflow: hidden; margin-top: 10px; border: 1px solid #ddd; }
    .custom-marker { width: 20px; height: 20px; background: #E74C3C; border: 2px solid #fff; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3); }
    
    .info-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.95rem; }
    .info-row.total { font-weight: bold; font-size: 1.2rem; border-top: 2px solid #ddd; padding-top: 10px; margin-top: 10px; }

    .btn-cancel-order { width: 100%; padding: 12px; background-color: #dc3545; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; margin-top: 20px; transition: background-color 0.2s; }
    .btn-cancel-order:hover { background-color: #c82333; }

    /* MODAL XÁC NHẬN */
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
      <StyleInjector styles={allStyles} />
      <LoadingSpinner isLoading={isLoading} />
        <Header/>
      {/* Modal Xác nhận Hủy */}
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Xác nhận hủy đơn hàng"
        message={`Bạn có chắc chắn muốn hủy đơn hàng #${orderToCancel?.id}? Hành động này không thể hoàn tác.`}
      />

      <div className="order-history-container">
        <h1 className="page-title">Lịch sử đơn hàng</h1>

        {/* --- FILTER --- */}
        <div className="filter-section">
          <div className="filter-group">
            <label>Từ ngày:</label>
            <input 
              type="date" 
              name="startDate" 
              className="filter-input"
              value={dateFilter.startDate} 
              onChange={handleFilterChange} 
            />
          </div>
          <div className="filter-group">
            <label>Đến ngày:</label>
            <input 
              type="date" 
              name="endDate" 
              className="filter-input"
              value={dateFilter.endDate} 
              onChange={handleFilterChange} 
            />
          </div>
        </div>

        {/* --- TABLE --- */}
        <div className="table-container">
          <table className="order-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Ngày đặt</th>
                <th>Khách hàng</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan="6" style={{textAlign: 'center'}}>Không có đơn hàng nào.</td></tr>
              ) : (
                orders.map(order => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>
                        <div>{order.customerName}</div>
                        <small style={{color:'#777'}}>{order.customerPhone}</small>
                    </td>
                    <td style={{fontWeight:'bold', color:'#007bff'}}>{formatPrice(order.totalPrice)}</td>
                    <td>{getStatusBadge(order.orderStatus === 'PENDING' && order.paymentStatus === 'SUCCESSFUL' ? 'PAID' : order.orderStatus)}</td>
                    <td>
                      <button className="btn-view" onClick={() => setSelectedOrder(order)}>
                        {faEye} Chi tiết
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* --- PAGINATION --- */}
        {totalPages > 1 && (
          <ReactPaginate
            breakLabel="..."
            nextLabel=">"
            onPageChange={handlePageClick}
            pageCount={totalPages}
            previousLabel="<"
            containerClassName="pagination"
            activeClassName="active"
            forcePage={currentPage}
          />
        )}

        {/* --- MODAL CHI TIẾT --- */}
        {selectedOrder && (
          <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setSelectedOrder(null)}>{faTimes}</button>
              
              <div className="modal-left">
                <div className="modal-header">
                  <h3>Chi tiết đơn hàng #{selectedOrder.id}</h3>
                  <p>{formatDate(selectedOrder.createdAt)}</p>
                  {getStatusBadge(selectedOrder.orderStatus)}
                </div>

                <div className="order-items-list">
                  {selectedOrder.orderItems && selectedOrder.orderItems.map((item, idx) => (
                    <div key={idx} className="order-item-detail">
                      <img src={item.thumbnail || "https://placehold.co/60"} alt="Product" />
                      <div>
                        <div style={{fontWeight:'600'}}>{item.productName || "Sản phẩm"}</div>
                        <div style={{color:'#666', fontSize:'0.9rem'}}>
                           Size: {item.dimensions} 
                        </div>
                        <div style={{color:'#666', fontSize:'0.9rem'}}>
                           Số lượng {item.quantity}
                        </div>
                        <div style={{color:'#007bff'}}>{formatPrice(item.priceAtPurchase)}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-summary">
                    <div className="info-row"><span>Tạm tính:</span> <span>{formatPrice(selectedOrder.subtotalPrice)}</span></div>
                    <div className="info-row"><span>Phí vận chuyển:</span> <span>{formatPrice(selectedOrder.shippingFee)}</span></div>
                    <div className="info-row" style={{color: 'green'}}><span>Giảm giá:</span> <span>-{formatPrice(selectedOrder.discountAmount)}</span></div>
                    <div className="info-row total"><span>Tổng cộng:</span> <span>{formatPrice(selectedOrder.totalPrice)}</span></div>
                </div>
              </div>

              <div className="modal-right">
                <h3>Thông tin giao hàng</h3>
                <p><strong>Người nhận:</strong> {selectedOrder.customerName}</p>
                <p><strong>SĐT:</strong> {selectedOrder.customerPhone}</p>
                <p><strong>Địa chỉ:</strong> {selectedOrder.address}</p>
                
                {selectedOrder.latitude && selectedOrder.longitude ? (
                    <>
                        <div style={{marginTop:'20px', fontWeight:'600'}}> Vị trí giao hàng:</div>
                        <div id="modal-map" ref={mapContainerRef} className="map-container-modal"></div>
                    </>
                ) : (
                    <p style={{fontStyle:'italic', color:'#888', marginTop:'20px'}}>Không có thông tin bản đồ cho đơn này.</p>
                )}

                {/* Nút Hủy Đơn (Chỉ hiện khi PENDING) */}
                {selectedOrder.orderStatus === 'PENDING' && (
                  <button 
                    className="btn-cancel-order"
                    onClick={handleOpenCancelModal} 
                  >
                    Hủy Đơn Hàng
                  </button>
                )}
              </div>

            </div>
          </div>
        )}

      </div>
    </>
  );
}
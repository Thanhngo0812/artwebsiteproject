import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';

const API_BASE_URL = "http://localhost:8888";
const TOMTOM_API_KEY = process.env.REACT_APP_TOMTOM_API_KEY;

// --- HELPER ---
const getAuthToken = () => localStorage.getItem('accessToken');
const createAuthHeaders = () => {
    const token = getAuthToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};
const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleString('vi-VN') : '';

// --- COMPONENT: MODAL CHI TIẾT ĐƠN HÀNG (CÓ MAP) ---
const OrderDetailModal = ({ isOpen, onClose, order }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (isOpen && order && order.latitude && order.longitude && window.tt) {
       // Đợi DOM render xong
       setTimeout(() => {
           if (mapContainerRef.current) {
               if (mapInstanceRef.current) {
                   mapInstanceRef.current.remove();
                   mapInstanceRef.current = null;
               }
               const coords = [order.longitude, order.latitude];
               const map = window.tt.map({
                   key: TOMTOM_API_KEY,
                   container: mapContainerRef.current,
                   center: coords,
                   zoom: 15
               });
               const el = document.createElement('div');
               el.className = 'custom-marker';
               new window.tt.Marker({ element: el }).setLngLat(coords).addTo(map);
               mapInstanceRef.current = map;
           }
       }, 100);
    }
  }, [isOpen, order]);

  if (!isOpen || !order) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{zIndex: 1100}}>
      <div className="modal-box" onClick={e => e.stopPropagation()} style={{width: '900px'}}>
        <div className="modal-header">
          <h3>Chi tiết đơn hàng #{order.id}</h3>
          <button onClick={onClose} style={{fontSize: 24, cursor: 'pointer', background:'none', border:'none'}}>×</button>
        </div>
        <div className="modal-body" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20}}>
            {/* Cột Trái: Sản phẩm */}
            <div>
                <h4 style={{margin:'0 0 10px 0', borderBottom:'1px solid #eee', paddingBottom:5}}>Sản phẩm</h4>
                <div style={{maxHeight: 300, overflowY: 'auto'}}>
                    {order.orderItems?.map((item, idx) => (
                        <div key={idx} style={{display:'flex', gap:10, marginBottom:10, borderBottom:'1px dashed #f0f0f0', paddingBottom:5}}>
                            <img src={item.thumbnail || "https://placehold.co/50"} alt="" style={{width:50, height:50, objectFit:'cover', borderRadius:4}} />
                            <div>
                                <div style={{fontWeight:'bold', fontSize:13}}>{item.productName}</div>
                                <div style={{fontSize:12, color:'#666'}}>Size: {item.dimensions} x {item.quantity}</div>
                                <div style={{color:'#007bff', fontSize:13}}>{formatCurrency(item.priceAtPurchase)}</div>
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{marginTop:10, paddingTop:10, borderTop:'2px solid #eee', display:'flex', justifyContent:'space-between', fontWeight:'bold'}}>
                    <span>Tổng cộng:</span>
                    <span style={{color:'#d32f2f'}}>{formatCurrency(order.totalPrice)}</span>
                </div>
            </div>

            {/* Cột Phải: Thông tin & Map */}
            <div>
                <h4 style={{margin:'0 0 10px 0', borderBottom:'1px solid #eee', paddingBottom:5}}>Thông tin giao hàng</h4>
                <div style={{fontSize:14, lineHeight:1.6}}>
                    <div><strong>Khách hàng:</strong> {order.customerName}</div>
                    <div><strong>SĐT:</strong> {order.customerPhone}</div>
                    <div><strong>Địa chỉ:</strong> {order.address}</div>
                    <div><strong>Trạng thái:</strong> <span style={{fontWeight:'bold', color: order.orderStatus==='CANCELLED'?'red':'green'}}>{order.orderStatus}</span></div>
                </div>

                <h4 style={{margin:'15px 0 10px 0', borderBottom:'1px solid #eee', paddingBottom:5}}>Vị trí</h4>
                {order.latitude ? (
                    <div ref={mapContainerRef} style={{width:'100%', height:200, borderRadius:8, border:'1px solid #ddd'}}></div>
                ) : (
                    <div style={{color:'#888', fontStyle:'italic'}}>Không có tọa độ bản đồ.</div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENT: MODAL DANH SÁCH ĐƠN HÀNG (Khi click vào Top Product/User) ---
const OrderListModal = ({ isOpen, onClose, title, orders, onOrderClick }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose} style={{zIndex: 1000}}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button onClick={onClose} style={{fontSize: 24, cursor: 'pointer', background:'none', border:'none'}}>×</button>
        </div>
        <div className="modal-body table-responsive">
          <table className="data-table">
            <thead><tr><th>Mã đơn</th><th>Ngày đặt</th><th>Khách hàng</th><th>Tổng tiền</th><th>Trạng thái</th></tr></thead>
            <tbody>
              {orders.length === 0 ? <tr><td colSpan="5">Không có đơn hàng nào.</td></tr> :
                orders.map(o => (
                  <tr key={o.id} onClick={() => onOrderClick(o)} className="clickable-row" title="Xem chi tiết">
                    <td>#{o.id}</td>
                    <td>{formatDate(o.createdAt)}</td>
                    <td>{o.customerName}</td>
                    <td style={{fontWeight:'bold', color:'#007bff'}}>{formatCurrency(o.totalPrice)}</td>
                    <td>{o.orderStatus}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


export default function Statistic() {
  const [activeTab, setActiveTab] = useState('PRODUCTS');
 function formatDateLocal(date) {
  return date.toLocaleDateString('sv-SE'); // yyyy-mm-dd
}

const [dateRange, setDateRange] = useState({
  startDate: formatDateLocal(new Date(new Date().getFullYear(), new Date().getMonth(), 1)),
  endDate: formatDateLocal(new Date()),
});

  const [isLoading, setIsLoading] = useState(false);
  
  const [topProducts, setTopProducts] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [revenueOrders, setRevenueOrders] = useState([]);
  const [revenueChartData, setRevenueChartData] = useState([]);

  // Modal List State
  const [listModalOpen, setListModalOpen] = useState(false);
  const [listModalTitle, setListModalTitle] = useState('');
  const [listModalOrders, setListModalOrders] = useState([]);

  // Modal Detail State (MỚI)
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);

  // Load TomTom SDK (Nếu chưa load)
  useEffect(() => {
      if (!window.tt) {
          const script = document.createElement('script');
          script.src = 'https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.25.0/maps/maps-web.min.js';
          script.async = true;
          document.body.appendChild(script);
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.25.0/maps/maps.css';
          document.head.appendChild(link);
      }
  }, []);

  useEffect(() => {
    fetchData();
  }, [activeTab, dateRange]);

  const fetchData = async () => {
    setIsLoading(true);
    const params = { startDate: dateRange.startDate, endDate: dateRange.endDate };
    try {
        if (activeTab === 'PRODUCTS') {
            const res = await axios.get(`${API_BASE_URL}/api/v1/admin/statistics/products/top`, { headers: createAuthHeaders(), params });
            setTopProducts(res.data);
        } else if (activeTab === 'USERS') {
            const res = await axios.get(`${API_BASE_URL}/api/v1/admin/statistics/users/top`, { headers: createAuthHeaders(), params });
            setTopUsers(res.data);
        } else if (activeTab === 'REVENUE') {
            const res = await axios.get(`${API_BASE_URL}/api/v1/admin/statistics/revenue/orders`, { headers: createAuthHeaders(), params });
            setRevenueOrders(res.data);
            processRevenueChart(res.data);
        }
    } catch (error) {
        toast.error("Lỗi tải dữ liệu thống kê.");
    } finally {
        setIsLoading(false);
    }
  };

  const processRevenueChart = (orders) => {
      const map = {};
      orders.forEach(o => {
          const date = o.createdAt.split('T')[0];
          map[date] = (map[date] || 0) + o.totalPrice;
      });
      const chartData = Object.keys(map).sort().map(date => ({
          date: new Date(date).toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit'}),
          revenue: map[date]
      }));
      setRevenueChartData(chartData);
  };

  // Handlers
  const handleProductClick = async (product) => {
      setListModalTitle(`Đơn hàng của sản phẩm: ${product.productName}`);
      setIsLoading(true);
      try {
          const res = await axios.get(`${API_BASE_URL}/api/v1/admin/statistics/products/${product.productId}/orders`, {
              headers: createAuthHeaders(),
              params: { startDate: dateRange.startDate, endDate: dateRange.endDate }
          });
          setListModalOrders(res.data);
          setListModalOpen(true);
      } catch(e) { toast.error("Lỗi tải chi tiết"); }
      finally { setIsLoading(false); }
  };

  const handleUserClick = async (user) => {
      setListModalTitle(`Lịch sử mua hàng:  ${user.username}`);
      setIsLoading(true);
      try {
          const res = await axios.get(`${API_BASE_URL}/api/v1/admin/statistics/users/${user.userId}/orders`, {
              headers: createAuthHeaders(),
              params: { startDate: dateRange.startDate, endDate: dateRange.endDate }
          });
          setListModalOrders(res.data);
          setListModalOpen(true);
      } catch(e) { toast.error("Lỗi tải chi tiết"); }
      finally { setIsLoading(false); }
  };

  // Khi click vào 1 đơn hàng (ở bất kỳ đâu: List Modal hay Revenue Table)
  const handleOrderClick = (order) => {
      setSelectedOrderDetail(order);
      setDetailModalOpen(true);
  };

  // CSS
  const styles = `
    .stat-container { padding: 20px; background: #f4f7fa; min-height: 100vh; font-family: sans-serif; }
    .stat-card { background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
    .filter-bar { display: flex; gap: 20px; margin-bottom: 20px; align-items: center; background: #fff; padding: 15px; border-radius: 8px; }
    .filter-item label { font-weight: 600; margin-right: 10px; font-size: 14px; }
    .filter-input { padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
    .tabs { display: flex; border-bottom: 1px solid #ddd; margin-bottom: 20px; }
    .tab { padding: 12px 24px; cursor: pointer; font-weight: 600; color: #666; border-bottom: 3px solid transparent; transition: all 0.2s; }
    .tab:hover { background: #f9f9f9; }
    .tab.active { color: #1890ff; border-bottom-color: #1890ff; }
    .data-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
    .data-table th { text-align: left; padding: 12px; background: #f8f9fa; border-bottom: 2px solid #eee; }
    .data-table td { padding: 12px; border-bottom: 1px solid #eee; }
    .clickable-row { cursor: pointer; transition: background 0.1s; }
    .clickable-row:hover { background: #e6f7ff; }
    .chart-container { height: 350px; margin-bottom: 30px; margin-top: 20px; }
    
    .modal-overlay { position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; }
    .modal-box { background: #fff; width: 800px; max-height: 80vh; border-radius: 8px; overflow: hidden; display: flex; flex-direction: column; }
    .modal-header { padding: 15px 20px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; background: #f8f9fa; }
    .modal-header h3 { margin: 0; font-size: 18px; }
    .modal-body { padding: 20px; overflow-y: auto; }
    .custom-marker { width: 20px; height: 20px; background: #E74C3C; border: 2px solid #fff; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3); }
  `;

  return (
    <>
      <style>{styles}</style>
      
      {/* Modal Danh sách đơn hàng (Khi click Top Product/User) */}
      <OrderListModal 
        isOpen={listModalOpen} 
        onClose={() => setListModalOpen(false)} 
        title={listModalTitle} 
        orders={listModalOrders}
        onOrderClick={handleOrderClick} 
      />

      {/* Modal Chi tiết đơn hàng (Có Map) */}
      <OrderDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        order={selectedOrderDetail}
      />

      <div className="stat-container">
        <div className="stat-card">
            <h2 style={{margin:'0 0 20px 0'}}>Thống kê Chi tiết</h2>
            
            <div className="filter-bar">
                <div className="filter-item">
                    <label>Từ ngày:</label>
                    <input type="date" className="filter-input" value={dateRange.startDate} onChange={e => setDateRange({...dateRange, startDate: e.target.value})} />
                </div>
                <div className="filter-item">
                    <label>Đến ngày:</label>
                    <input type="date" className="filter-input" value={dateRange.endDate} onChange={e => setDateRange({...dateRange, endDate: e.target.value})} />
                </div>
                <div style={{marginLeft:'auto', fontStyle:'italic', color:'#888', fontSize:13}}>
                    Dữ liệu được tính dựa trên đơn hàng thành công (PAID/DELIVERED)
                </div>
            </div>

            <div className="tabs">
                <div className={`tab ${activeTab === 'PRODUCTS' ? 'active' : ''}`} onClick={() => setActiveTab('PRODUCTS')}>Top Sản Phẩm</div>
                <div className={`tab ${activeTab === 'USERS' ? 'active' : ''}`} onClick={() => setActiveTab('USERS')}>Top Khách Hàng</div>
                <div className={`tab ${activeTab === 'REVENUE' ? 'active' : ''}`} onClick={() => setActiveTab('REVENUE')}>Doanh Thu</div>
            </div>

            {isLoading && <div style={{textAlign:'center', padding: 20}}>Đang tải dữ liệu...</div>}

            {!isLoading && activeTab === 'PRODUCTS' && (
                <div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
  <BarChart data={topProducts}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="productName" tick={false} />

    {/* Trục Y cho số lượng bán */}
    <YAxis yAxisId="left" />

    {/* Trục Y cho doanh thu */}
    <YAxis yAxisId="right" orientation="right" />

    <Tooltip
      formatter={(val, name) =>
        name === "Doanh thu" ? formatCurrency(val) : val
      }
    />
    <Legend />

    {/* Cột doanh thu */}
    <Bar
      yAxisId="right"
      dataKey="totalRevenue"
      name="Doanh thu"
      fill="#8884d8"
    />

    {/* Cột số lượng bán */}
    <Bar
      yAxisId="left"
      dataKey="soldQuantity"
      name="Số lượng bán"
      fill="#82ca9d"
    />
  </BarChart>
</ResponsiveContainer>

                    </div>
                    <h3>Top 10 Sản phẩm bán chạy nhất</h3>
                    <table className="data-table">
                        <thead><tr><th>#</th><th>Ảnh</th><th>Tên sản phẩm</th><th>Số lượng bán</th><th>Doanh thu</th></tr></thead>
                        <tbody>
                            {topProducts.map((p, idx) => (
                                <tr key={idx} className="clickable-row" onClick={() => handleProductClick(p)} title="Click xem đơn hàng">
                                    <td>{idx + 1}</td>
                                    <td><img src={p.thumbnail} alt="" style={{width:40, height:40, borderRadius:4, objectFit:'cover'}}/></td>
                                    <td>{p.productName}</td>
                                    <td>{p.soldQuantity}</td>
                                    <td style={{fontWeight:'bold', color:'#28a745'}}>{formatCurrency(p.totalRevenue)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {!isLoading && activeTab === 'USERS' && (
                <div>
                    <h3>Top 10 Khách hàng thân thiết</h3>
                    <table className="data-table">
                        <thead><tr><th>#</th><th>Tên khách hàng</th><th>Email</th><th>Tổng đơn hàng</th><th>Tổng chi tiêu</th></tr></thead>
                        <tbody>
                            {topUsers.map((u, idx) => (
                                <tr key={idx} className="clickable-row" onClick={() => handleUserClick(u)} title="Click xem lịch sử mua">
                                    <td>{idx + 1}</td>
                                    <td>{u.fullName || u.username}</td>
                                    <td>{u.email}</td>
                                    <td>{u.totalOrders}</td>
                                    <td style={{fontWeight:'bold', color:'#d32f2f'}}>{formatCurrency(u.totalSpent)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {!isLoading && activeTab === 'REVENUE' && (
                <div>
                    <div className="chart-container">
                         <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis tickFormatter={(val) => val >= 1000000 ? `${val/1000000}M` : val} />
                                <Tooltip formatter={(val) => formatCurrency(val)} />
                                <Area type="monotone" dataKey="revenue" name="Doanh thu" stroke="#82ca9d" fill="#82ca9d" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <h3>Chi tiết đơn hàng trong khoảng thời gian</h3>
                    <table className="data-table">
                        <thead><tr><th>Mã đơn</th><th>Ngày tạo</th><th>Khách hàng</th><th>Tổng tiền</th><th>Trạng thái</th></tr></thead>
                        <tbody>
                             {revenueOrders.map(o => (
                                 <tr key={o.id} onClick={() => handleOrderClick(o)} className="clickable-row" title="Click xem chi tiết">
                                     <td>#{o.id}</td>
                                     <td>{formatDate(o.createdAt)}</td>
                                     <td>{o.customerName}</td>
                                     <td style={{fontWeight:'bold'}}>{formatCurrency(o.totalPrice)}</td>
                                     <td>{o.orderStatus}</td>
                                 </tr>
                             ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
      </div>
    </>
  );
}
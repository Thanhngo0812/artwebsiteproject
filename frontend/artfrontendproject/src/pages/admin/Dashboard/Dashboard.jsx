import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { 
  FaShoppingCart, FaDollarSign, FaUsers, FaBoxOpen, 
  FaArrowUp, FaArrowDown 
} from 'react-icons/fa';

// --- CONSTANTS ---
const API_BASE_URL = "https://deployforstudy-1.onrender.com";
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// --- HELPER: StyleInjector ---
const StyleInjector = ({ styles }) => {
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
    return () => document.head.removeChild(styleElement);
  }, [styles]);
  return null;
};

const getAuthToken = () => localStorage.getItem('user');
const createAuthHeaders = () => {
    const token = getAuthToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};
const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);


export default function Dashboard() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/v1/admin/dashboard/stats`, { headers: createAuthHeaders() });
        console.log(res.data)
        setData(res.data);
        setIsLoading(false);

        // --- MOCK DATA (Dữ liệu giả để demo giao diện đẹp) ---
        // setTimeout(() => {
        //     setData({
        //         totalRevenue: 158500000,
        //         totalOrders: 142,
        //         totalUsers: 89,
        //         lowStockProducts: 5,
        //         revenueChart: [
        //             { date: '20/11', revenue: 5000000 },
        //             { date: '21/11', revenue: 7200000 },
        //             { date: '22/11', revenue: 4500000 },
        //             { date: '23/11', revenue: 12000000 },
        //             { date: '24/11', revenue: 8900000 },
        //             { date: '25/11', revenue: 15000000 },
        //             { date: '26/11', revenue: 11500000 },
        //         ],
        //         orderStatusCounts: [
        //             { name: 'Thành công', value: 85 },
        //             { name: 'Đang giao', value: 25 },
        //             { name: 'Chờ xử lý', value: 20 },
        //             { name: 'Đã hủy', value: 12 },
        //         ],
        //         recentOrders: [
        //             { id: 105, customerName: 'Nguyễn Văn A', totalPrice: 1500000, status: 'PENDING', date: '2023-11-26 10:30' },
        //             { id: 104, customerName: 'Trần Thị B', totalPrice: 2200000, status: 'PAID', date: '2023-11-26 09:15' },
        //             { id: 103, customerName: 'Lê Văn C', totalPrice: 850000, status: 'SHIPPED', date: '2023-11-25 14:20' },
        //             { id: 102, customerName: 'Phạm Thị D', totalPrice: 5000000, status: 'DELIVERED', date: '2023-11-25 11:00' },
        //             { id: 101, customerName: 'Hoàng Văn E', totalPrice: 1200000, status: 'CANCELLED', date: '2023-11-24 16:45' },
        //         ]
        //     });
        //     setIsLoading(false);
        // }, 1000);
      } catch (error) {
        console.error("Lỗi tải dashboard:", error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- CSS ---
  const styles = `
    .dashboard-container { padding: 25px; background-color: #f4f7fa; min-height: 100vh; font-family: 'Segoe UI', sans-serif; }
    .page-title { font-size: 24px; font-weight: 700; color: #333; margin-bottom: 25px; }

    /* --- STAT CARDS --- */
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-bottom: 30px; }
    .stat-card { background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); display: flex; align-items: center; transition: transform 0.2s; }
    .stat-card:hover { transform: translateY(-5px); }
    .stat-icon-wrapper { width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-right: 20px; }
    .stat-info h3 { margin: 0; font-size: 14px; color: #888; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
    .stat-info .value { font-size: 24px; font-weight: 800; color: #333; margin-top: 5px; display: block; }
    
    /* Color variants for cards */
    .stat-blue .stat-icon-wrapper { background: #e6f7ff; color: #1890ff; }
    .stat-green .stat-icon-wrapper { background: #f6ffed; color: #52c41a; }
    .stat-purple .stat-icon-wrapper { background: #f9f0ff; color: #722ed1; }
    .stat-orange .stat-icon-wrapper { background: #fff7e6; color: #fa8c16; }

    /* --- CHARTS SECTION --- */
    .charts-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-bottom: 30px; }
    @media (max-width: 1024px) { .charts-grid { grid-template-columns: 1fr; } }
    
    .chart-card { background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); height: 400px; }
    .chart-title { font-size: 18px; font-weight: 700; color: #444; margin-bottom: 20px; }

    /* --- RECENT ORDERS --- */
    .recent-orders-card { background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); }
    .table-responsive { overflow-x: auto; }
    .dashboard-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    .dashboard-table th { text-align: left; padding: 15px; border-bottom: 2px solid #f0f0f0; color: #666; font-weight: 600; }
    .dashboard-table td { padding: 15px; border-bottom: 1px solid #f9f9f9; color: #333; font-size: 14px; }
    
    .status-badge { padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: bold; text-transform: uppercase; }
    .status-pending { background: #fffbe6; color: #fa8c16; border: 1px solid #ffe58f; }
    .status-paid { background: #f6ffed; color: #52c41a; border: 1px solid #b7eb8f; }
    .status-shipped { background: #e6f7ff; color: #1890ff; border: 1px solid #91d5ff; }
    .status-delivered { background: #f6ffed; color: #52c41a; border: 1px solid #b7eb8f; }
    .status-cancelled { background: #fff1f0; color: #f5222d; border: 1px solid #ffa39e; }

    .loading-center { display: flex; justify-content: center; align-items: center; height: 100vh; }
  `;

  const getStatusBadge = (status) => {
      const map = {
          'PENDING': { cls: 'status-pending', txt: 'PENDING' },
          'PAID': { cls: 'status-paid', txt: 'PAID' },
          'SHIPPED': { cls: 'status-shipped', txt: 'SHIPPED' },
          'DELIVERED': { cls: 'status-delivered', txt: 'DELIVERED' },
          'CANCELLED': { cls: 'status-cancelled', txt: 'CANCELLED' }
      };
      const s = map[status] || { cls: 'status-pending', txt: status };
      return <span className={`status-badge ${s.cls}`}>{s.txt}</span>;
  };

  if (isLoading) return <div className="loading-center">Đang tải dữ liệu...</div>;
  if (!data) return <div className="loading-center">Không có dữ liệu.</div>;

  return (
    <>
      <StyleInjector styles={styles} />
      <div className="dashboard-container">
        <h1 className="page-title">Tổng quan Kinh doanh</h1>

        {/* 1. STATS CARDS */}
        <div className="stats-grid">
            <div className="stat-card stat-blue">
                <div className="stat-icon-wrapper"><FaDollarSign /></div>
                <div className="stat-info">
                    <h3>Tổng Doanh thu</h3>
                    <span className="value">{formatCurrency(data.totalRevenue)}</span>
                </div>
            </div>
            <div className="stat-card stat-purple">
                <div className="stat-icon-wrapper"><FaShoppingCart /></div>
                <div className="stat-info">
                    <h3>Tổng đơn hàng</h3>
                    <span className="value">{data.totalOrders}</span>
                </div>
            </div>
            <div className="stat-card stat-green">
                <div className="stat-icon-wrapper"><FaUsers /></div>
                <div className="stat-info">
                    <h3>Khách hàng</h3>
                    <span className="value">{data.totalUsers}</span>
                </div>
            </div>
            <div className="stat-card stat-orange">
                <div className="stat-icon-wrapper"><FaBoxOpen /></div>
                <div className="stat-info">
                    <h3>Sắp hết hàng</h3>
                    <span className="value">{data.lowStockProducts}</span>
                </div>
            </div>
        </div>

        {/* 2. CHARTS ROW */}
        <div className="charts-grid">
            {/* Line Chart: Doanh thu */}
            <div className="chart-card">
                <h3 className="chart-title">Biểu đồ Doanh thu (7 ngày qua)</h3>
                <ResponsiveContainer width="100%" height={320}>
                    <LineChart data={data.revenueChart}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="date" stroke="#888" />
                        <YAxis stroke="#888" tickFormatter={(val) => val >= 1000000 ? `${val/1000000}M` : val} />
                        <Tooltip formatter={(val) => formatCurrency(val)} />
                        <Line type="monotone" dataKey="revenue" stroke="#0088FE" strokeWidth={3} dot={{r:4}} activeDot={{r:6}} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Pie Chart: Trạng thái đơn hàng */}
            <div className="chart-card">
                <h3 className="chart-title">Tỷ lệ Đơn hàng</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={data.orderStatusCounts}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                        >
                           {Object.entries(data.orderStatusCounts).map(([status, count], index) => (
    <Cell
        key={`cell-${index}`}
        fill={COLORS[index % COLORS.length]}
        name={status}     // key
        value={count}     // value
    />
))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* 3. RECENT ORDERS TABLE */}
        <div className="recent-orders-card">
            <h3 className="chart-title">Đơn hàng mới nhất</h3>
            <div className="table-responsive">
                <table className="dashboard-table">
                    <thead>
                        <tr>
                            <th>Mã đơn</th>
                            <th>Khách hàng</th>
                            <th>Ngày đặt</th>
                            <th>Tổng tiền</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.recentOrders.map(order => (
                            <tr key={order.id}>
                                <td>#{order.id}</td>
                                <td>{order.customerName}</td>
                                <td> {new Date(order.createdAt).toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour12: false
  })}</td>
                                <td style={{fontWeight:'bold', color:'#333'}}>{formatCurrency(order.totalPrice)}</td>
                                <td>{getStatusBadge(order.orderStatus)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

      </div>
    </>
  );
}



import React, { useEffect, useState } from "react";
import axios from "axios";
// import productService from "../../service/productService";
import "./GoodsReceipts.scss";
import ProductVariantSelector from '../../../components/layout/AdminLayout/ProductVariantSelector';
import { 
  FaPlus, 
  FaTrash, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaChevronDown, 
  FaChevronUp,
  FaSearch,
  FaFileInvoice,
  FaBoxOpen 
} from "react-icons/fa";

const API_BASE_URL = 'http://localhost:8888';

export default function GoodsReceipts() {
  const [receipts, setReceipts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [filteredReceipts, setFilteredReceipts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isVariantSelectorOpen, setIsVariantSelectorOpen] = useState(false);
  const [currentRowIndex, setCurrentRowIndex] = useState(null);
  
  const [form, setForm] = useState({
    supplierId: '',
    note: '',
    receiptItems: [{ variantId: '', quantity: 1, importPrice: '', newSellingPrice: '' }]
  });
  
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  
  const [filter, setFilter] = useState({
    supplierId: '',
    receiptCode: '',
    dateFrom: '',
    dateTo: ''
  });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let data = receipts || [];
    if (filter.supplierId) 
      data = data.filter(r => String(r.supplierId) === String(filter.supplierId));
    if (filter.receiptCode) 
      data = data.filter(r => (r.receiptCode||'').toLowerCase().includes(filter.receiptCode.toLowerCase()));
    if (filter.dateFrom) 
      data = data.filter(r => new Date(r.createdAt) >= new Date(filter.dateFrom));
    if (filter.dateTo) 
      data = data.filter(r => new Date(r.createdAt) <= new Date(filter.dateTo));
    setFilteredReceipts(data);
  }, [filter, receipts]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('user');
      const [r1, r2] = await Promise.all([
        axios.get(`${API_BASE_URL}/admin/goods-receipts`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_BASE_URL}/admin/suppliers`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setReceipts(r1.data || []);
      setSuppliers(r2.data || []);
    } catch (err) {
      console.error(err);
      showToast('Không thể tải dữ liệu', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchReceiptDetails = async (receiptId) => {
    try {
      const token = localStorage.getItem('user');
      const res = await axios.get(`${API_BASE_URL}/admin/goods-receipts/${receiptId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedReceipt(res.data);
      setIsDetailModalOpen(true);
    } catch (err) {
      console.error(err);
      showToast('Không thể tải chi tiết phiếu nhập', 'error');
    }
  };

  const addItemRow = () => 
    setForm({ 
      ...form, 
      receiptItems: [...form.receiptItems, { variantId: '', quantity: 1, importPrice: '', newSellingPrice: '' }] 
    });

  const removeItemRow = (idx) => 
    setForm({ 
      ...form, 
      receiptItems: form.receiptItems.filter((_, i) => i !== idx) 
    });

  
  const handleVariantSelect = (variantData) => {
    const arr = [...form.receiptItems];
    arr[currentRowIndex].variantId = variantData.variantId;
    arr[currentRowIndex].variantInfo = variantData;
    
    

    if (!arr[currentRowIndex].importPrice) {
        let autoImportPrice = 0;
        
        
        if (variantData.costPrice && variantData.costPrice > 0) {
        autoImportPrice = variantData.costPrice;
        } 

        else if (variantData.price && variantData.price > 0) {
        autoImportPrice = Math.floor(variantData.price * 0.7);
        }
        
        arr[currentRowIndex].importPrice = autoImportPrice;
    }
    

    if (!arr[currentRowIndex].newSellingPrice) {
        arr[currentRowIndex].newSellingPrice = variantData.price || '';
    }
    
    setForm({ ...form, receiptItems: arr });
    setIsVariantSelectorOpen(false);
    setCurrentRowIndex(null);
};

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem('user');
      
      for (const it of form.receiptItems) {
        if (!it.variantId) throw new Error('Mỗi hàng phải có Variant ID');
        if (!it.quantity || Number(it.quantity) <= 0) throw new Error('Số lượng phải > 0');
      }
      
      const payload = {
        supplierId: form.supplierId || null,
        note: form.note,
        receiptItems: form.receiptItems.map(it => ({
          variantId: Number(it.variantId),
          quantity: Number(it.quantity),
          importPrice: Number(it.importPrice),
          newSellingPrice: it.newSellingPrice ? Number(it.newSellingPrice) : null
        }))
      };
      
      await axios.post(`${API_BASE_URL}/admin/goods-receipts`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      showToast('Tạo phiếu nhập thành công', 'success');
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || err?.message || 'Lỗi khi tạo phiếu nhập';
      showToast(msg, 'error');
    }
  };

  const clearFilters = () => {
    setFilter({ supplierId: '', receiptCode: '', dateFrom: '', dateTo: '' });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('vi-VN');
  };

  return (
    <div className="user-container">
      {/* Bộ lọc */}
      <div className="filters-content">
        <div className="filters-header">
          <div 
            className="filters-title" 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <span>
              <FaSearch /> Bộ Lọc Phiếu Nhập
            </span>
            {isFilterOpen ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          <button className="btn-clear" onClick={clearFilters}>
            Xóa bộ lọc
          </button>
        </div>

        <div className={`filters-items ${isFilterOpen ? 'open' : 'close'}`}>
          <div className="item">
            <label>Nhà cung cấp</label>
            <select 
              value={filter.supplierId} 
              onChange={(e) => setFilter({ ...filter, supplierId: e.target.value })}
            >
              <option value="">Tất cả</option>
              {suppliers.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="item">
            <label>Mã phiếu nhập</label>
            <input 
              type="text" 
              placeholder="Tìm theo mã..." 
              value={filter.receiptCode}
              onChange={(e) => setFilter({ ...filter, receiptCode: e.target.value })}
            />
          </div>

          <div className="item">
            <label>Từ ngày</label>
            <input 
              type="date" 
              value={filter.dateFrom}
              onChange={(e) => setFilter({ ...filter, dateFrom: e.target.value })}
            />
          </div>

          <div className="item">
            <label>Đến ngày</label>
            <input 
              type="date" 
              value={filter.dateTo}
              onChange={(e) => setFilter({ ...filter, dateTo: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Danh sách phiếu nhập */}
      <div className="show-users">
        <div className="show-users_header">
          <h2 className="show-users_title">
            <FaFileInvoice /> Danh Sách Phiếu Nhập
          </h2>
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            <FaPlus /> Tạo phiếu nhập
          </button>
        </div>

        <div className="show-users_content">
          <div className="table-container">
            {loading ? (
              <p className="loading-text">Đang tải...</p>
            ) : (
              <table className="users-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Mã PN</th>
                    <th>Nhà cung cấp</th>
                    <th>Người tạo</th>
                    <th>Tổng tiền</th>
                    <th>Ngày tạo</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReceipts.length === 0 ? (
                    <tr className="empty-row">
                      <td colSpan="7">Không có dữ liệu</td>
                    </tr>
                  ) : (
                    filteredReceipts.map(r => (
                      <tr key={r.id}>
                        <td data-label="ID">#{r.id}</td>
                        <td data-label="Mã PN">
                          <span className="receipt-code">{r.receiptCode}</span>
                        </td>
                        <td data-label="Nhà cung cấp">{r.supplierName || '-'}</td>
                        <td data-label="Người tạo">{r.creatorName || '-'}</td>
                        <td data-label="Tổng tiền">
                          <span className="total-amount">{formatCurrency(r.totalAmount)}</span>
                        </td>
                        <td data-label="Ngày tạo">{formatDate(r.createdAt)}</td>
                        <td data-label="Hành động">
                          <button 
                            className="btn-view" 
                            onClick={() => fetchReceiptDetails(r.id)}
                          >
                            <FaBoxOpen /> Chi tiết
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Modal tạo phiếu nhập */}
      {isModalOpen && (
        <div className="confirm-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="confirm-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-modal-header">
              <FaPlus />
              Tạo Phiếu Nhập Mới
            </div>
            <div className="confirm-modal-body">
              <div className="form-row">
                <label>Nhà cung cấp</label>
                <select 
                  value={form.supplierId} 
                  onChange={(e) => setForm({ ...form, supplierId: e.target.value })}
                >
                  <option value="">Chọn nhà cung cấp</option>
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <label>Ghi chú</label>
                <textarea 
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  placeholder="Nhập ghi chú..."
                  rows="3"
                />
              </div>

              <div className="form-row">
                <label>Danh sách sản phẩm</label>
                <div className="items-list">
                {form.receiptItems.map((item, idx) => (
                    <div key={idx} className="item-row">
                    {/* Hiển thị thông tin đã chọn hoặc nút chọn */}
                    {item.variantInfo ? (
                        <div className="selected-variant-info">
                        <img 
                            src={item.variantInfo.thumbnail || '/placeholder.png'} 
                            alt={item.variantInfo.productName}
                            className="variant-thumbnail"
                        />
                        <div className="variant-text">
                            <strong>{item.variantInfo.productName}</strong>
                            <span>{item.variantInfo.dimensions}</span>
                        </div>
                        <button
                            type="button"
                            className="btn-change-variant"
                            onClick={() => {
                            setCurrentRowIndex(idx);
                            setIsVariantSelectorOpen(true);
                            }}
                        >
                            Đổi
                        </button>
                        </div>
                    ) : (
                        <button
                        type="button"
                        className="btn-select-product"
                        onClick={() => {
                            setCurrentRowIndex(idx);
                            setIsVariantSelectorOpen(true);
                        }}
                        >
                        <FaSearch /> Chọn sản phẩm
                        </button>
                    )}

                    <input 
                        type="number" 
                        className="small"
                        placeholder="SL"
                        value={item.quantity}
                        onChange={(e) => {
                        const arr = [...form.receiptItems];
                        arr[idx].quantity = e.target.value;
                        setForm({ ...form, receiptItems: arr });
                        }}
                    />
                    
                    <input 
                        type="number" 
                        placeholder="Giá nhập"
                        value={item.importPrice}
                        onChange={(e) => {
                        const arr = [...form.receiptItems];
                        arr[idx].importPrice = e.target.value;
                        setForm({ ...form, receiptItems: arr });
                        }}
                    />
                    
                    <input 
                        type="number" 
                        placeholder="Giá bán mới"
                        value={item.newSellingPrice}
                        onChange={(e) => {
                        const arr = [...form.receiptItems];
                        arr[idx].newSellingPrice = e.target.value;
                        setForm({ ...form, receiptItems: arr });
                        }}
                    />
                    
                    <button 
                        type="button" 
                        className="btn-delete"
                        onClick={() => removeItemRow(idx)}
                    >
                        <FaTrash />
                    </button>
                    </div>
                ))}
                </div>
                <button type="button" className="btn-add-item" onClick={addItemRow}>
                  <FaPlus /> Thêm sản phẩm
                </button>
              </div>
            </div>

            <div className="confirm-modal-actions">
              <button className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                Hủy
              </button>
              <button className="btn-primary" onClick={handleCreate}>
                <FaCheckCircle /> Tạo phiếu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal chi tiết phiếu nhập */}
      {isDetailModalOpen && selectedReceipt && (
        <div className="confirm-modal-overlay" onClick={() => setIsDetailModalOpen(false)}>
          <div className="detail-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-modal-header">
              <FaFileInvoice />
              Chi Tiết Phiếu Nhập
            </div>

            <div className="detail-modal-body">
              <div className="detail-info-grid">
                <div className="info-item">
                  <span className="info-label">Mã phiếu:</span>
                  <span className="info-value receipt-code">{selectedReceipt.receiptCode}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Nhà cung cấp:</span>
                  <span className="info-value">{selectedReceipt.supplierName || '-'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Người tạo:</span>
                  <span className="info-value">{selectedReceipt.creatorName || '-'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Ngày tạo:</span>
                  <span className="info-value">{formatDate(selectedReceipt.createdAt)}</span>
                </div>
                <div className="info-item full-width">
                  <span className="info-label">Ghi chú:</span>
                  <span className="info-value">{selectedReceipt.note || 'Không có'}</span>
                </div>
              </div>

              <div className="detail-items-section">
                <h3>Danh sách sản phẩm</h3>
                <table className="detail-items-table">
                  <thead>
                    <tr>
                      <th>Variant ID</th>
                      <th>Tên sản phẩm</th>
                      <th>Số lượng</th>
                      <th>Giá nhập</th>
                      <th>Giá bán</th>
                      <th>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedReceipt.items?.map((item, idx) => (
                      <tr key={idx}>
                        <td data-label="Variant ID">#{item.variantId}</td>
                        <td data-label="Tên">{item.variantName || item.productName || '-'}</td>
                        <td data-label="SL">{item.quantity}</td>
                        <td data-label="Giá nhập">{formatCurrency(item.importPrice)}</td>
                        <td data-label="Giá bán">{formatCurrency(item.newSellingPrice)}</td>
                        <td data-label="Thành tiền">
                          <strong>{formatCurrency(item.quantity * item.importPrice)}</strong>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="5" className="text-right"><strong>Tổng cộng:</strong></td>
                      <td><strong className="total-highlight">{formatCurrency(selectedReceipt.totalAmount)}</strong></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="confirm-modal-actions">
              <button className="btn-secondary" onClick={() => setIsDetailModalOpen(false)}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast notification */}
      {toast.show && (
        <div className={`toast-notification ${toast.type}`}>
          {toast.type === 'success' ? <FaCheckCircle /> : <FaTimesCircle />}
          {toast.message}
        </div>
      )}
      <ProductVariantSelector
        isOpen={isVariantSelectorOpen}
        onClose={() => {
            setIsVariantSelectorOpen(false);
            setCurrentRowIndex(null);
        }}
        onSelect={handleVariantSelect}
      />
    </div>
  );
}

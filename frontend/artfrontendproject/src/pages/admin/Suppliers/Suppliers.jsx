import React, { useEffect, useState } from "react";
import axios from "axios";
// import "./css/User.scss";
import "./Suppliers.scss";
import { FaTrash, FaEdit, FaPlus, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const API_BASE_URL = 'http://localhost:8888';

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', contactPerson: '', email: '', phoneNumber: '', address: '' });
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!search) setFiltered(suppliers);
    else {
      const q = search.toLowerCase();
      setFiltered(suppliers.filter(s => (s.name || '').toLowerCase().includes(q) || (s.contactPerson||'').toLowerCase().includes(q) || (s.phoneNumber||'').toLowerCase().includes(q)));
    }
  }, [search, suppliers]);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('user');
      const res = await axios.get(`${API_BASE_URL}/admin/suppliers`, { headers: { Authorization: `Bearer ${token}` } });
      setSuppliers(res.data || []);
    } catch (err) {
      console.error(err);
      showToast('Không thể tải danh sách nhà cung cấp', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', contactPerson: '', email: '', phoneNumber: '', address: '' });
    setIsModalOpen(true);
  };

  const openEdit = (s) => {
    setEditing(s);
    setForm({ name: s.name || '', contactPerson: s.contactPerson || '', email: s.email || '', phoneNumber: s.phoneNumber || '', address: s.address || '' });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('user');
      if (editing) {
        await axios.put(`${API_BASE_URL}/admin/suppliers/${editing.id}`, form, { headers: { Authorization: `Bearer ${token}` } });
        showToast('Cập nhật nhà cung cấp thành công', 'success');
      } else {
        await axios.post(`${API_BASE_URL}/admin/suppliers`, form, { headers: { Authorization: `Bearer ${token}` } });
        showToast('Tạo nhà cung cấp thành công', 'success');
      }
      setIsModalOpen(false);
      fetchSuppliers();
    } catch (err) {
      console.error(err);
      showToast('Lỗi khi lưu nhà cung cấp', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa nhà cung cấp này không?')) return;
    try {
      const token = localStorage.getItem('user');
      await axios.delete(`${API_BASE_URL}/admin/suppliers/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      showToast('Xóa nhà cung cấp thành công', 'success');
      fetchSuppliers();
    } catch (err) {
      console.error(err);
      showToast('Không thể xóa nhà cung cấp', 'error');
    }
  };

  return (
    <div className="user-container">
      {toast.show && (
        <div className={`toast-notification ${toast.type}`}>
          {toast.type === 'success' ? <FaCheckCircle /> : <FaTimesCircle />}
          <span>{toast.message}</span>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2>DANH SÁCH NHÀ CUNG CẤP</h2>
        <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
          <input placeholder="Tìm kiếm" value={search} onChange={e => setSearch(e.target.value)} style={{padding: '8px 10px', borderRadius: 8, border: '1px solid #e6eef6'}} />
          <button className="btn-primary" onClick={openCreate}><FaPlus /> Thêm nhà cung cấp</button>
        </div>
      </div>

      <div className="show-users_content">
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>Đang tải...</div>
        ) : (
          <div className="table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên</th>
                  <th>Người Liên Hệ</th>
                  <th>Email</th>
                  <th>Điện Thoại</th>
                  <th>Địa Chỉ</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan="7" style={{ textAlign: 'center', padding: 40 }}>Không có dữ liệu</td></tr>
                ) : filtered.map(s => (
                  <tr key={s.id}>
                    <td data-label="ID">#{s.id}</td>
                    <td data-label="Tên">{s.name}</td>
                    <td data-label="Người Liên Hệ">{s.contactPerson || '-'}</td>
                    <td data-label="Email">{s.email || '-'}</td>
                    <td data-label="Điện Thoại">{s.phoneNumber}</td>
                    <td data-label="Địa Chỉ" style={{ maxWidth: 300 }}>{s.address}</td>
                    <td data-label="Hành động">
                      <button className="btn-edit" onClick={() => openEdit(s)} title="Sửa"><FaEdit/></button>
                      <button className="btn-delete" onClick={() => handleDelete(s.id)} title="Xóa"><FaTrash/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="confirm-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="confirm-modal-box" onClick={(e) => e.stopPropagation()} style={{ width: 700 }}>
            <div className="confirm-modal-header"><h3>{editing ? 'Sửa Nhà Cung Cấp' : 'Tạo Nhà Cung Cấp'}</h3></div>
            <div className="confirm-modal-body">
              <div className="form-row">
                <label>Tên</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-row">
                <label>Người liên hệ</label>
                <input value={form.contactPerson} onChange={e => setForm({ ...form, contactPerson: e.target.value })} />
              </div>
              <div className="form-row">
                <label>Email</label>
                <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="form-row">
                <label>Điện thoại</label>
                <input value={form.phoneNumber} onChange={e => setForm({ ...form, phoneNumber: e.target.value })} />
              </div>
              <div className="form-row">
                <label>Địa chỉ</label>
                <textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
              </div>
            </div>
            <div className="confirm-modal-actions">
              <button className="btn-secondary" onClick={() => setIsModalOpen(false)}>Hủy</button>
              <button className="btn-primary" onClick={handleSave}>Lưu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

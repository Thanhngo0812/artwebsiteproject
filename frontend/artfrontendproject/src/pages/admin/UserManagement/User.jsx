import React, { useEffect, useState } from "react";
import axios from "axios";
import "./User.scss";
import { FaChevronUp, FaChevronDown, FaEdit, FaTrash, FaPlus, FaLock, FaUnlock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const API_BASE_URL = 'http://localhost:8888';

export default function User() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [availableRoles, setAvailableRoles] = useState(['ROLE_USER', 'ROLE_ADMIN']); 
  const [openFilter, setOpenFilter] = useState(true);
  const [filters, setFilters] = useState({
    id: "",
    username: "",
    email: "",
    fullname: "",
    role: "",
    status: "",
  });

  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({});

  // NOTIFICATION STATE
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const [isEditRoleModalOpen, setIsEditRoleModalOpen] = useState(false);
  const [editRoleForm, setEditRoleForm] = useState({
    userId: null,
    username: '',
    currentRole: '',
    newRole: 'ROLE_USER'
  });

  const [createForm, setCreateForm] = useState({
    username: '',
    password: '',
    email: '',
    fullName: '',
    phoneNumber: '',
    roles: ['ROLE_USER'] // Default
  });


  const handleCreateUser = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('user');
      
      await axios.post(`${API_BASE_URL}/api/admin/users`, createForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      showToast('Tạo user thành công!', 'success');
      setIsCreateModalOpen(false);
      setCreateForm({
        username: '',
        password: '',
        email: '',
        fullName: '',
        phoneNumber: '',
        roles: ['ROLE_USER']
      });
      fetchUsers();
    } catch (err) {
      const msg = err?.response?.data?.message || 'Lỗi khi tạo user';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditRole = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('user');
      
      await axios.put(
        `${API_BASE_URL}/api/admin/users/${editRoleForm.userId}`,
        { roles: [editRoleForm.newRole] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      showToast('Cập nhật role thành công!', 'success');
      setIsEditRoleModalOpen(false);
      fetchUsers();
    } catch (err) {
      const msg = err?.response?.data?.message || 'Lỗi khi cập nhật role';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };
  const handleResetFilters = () => {
    setFilters({
      id: "",
      username: "",
      email: "",
      fullname: "",
      role: "",
      status: "",
    });
    setCurrentPage(1);
  };

  const handleFiltersChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getUserStatus = (user) => {
    if (!user.accountNonLocked) return "BANNED";
    if (!user.enabled) return "INACTIVE";
    return "ACTIVE";
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage - 1,
        size: pageSize,
        ...(filters.id && { id: filters.id }),
        ...(filters.username && { username: filters.username }),
        ...(filters.email && { email: filters.email }),
        ...(filters.fullname && { fullname: filters.fullname }),
        ...(filters.role && { role: filters.role }),
        ...(filters.status && { status: filters.status }),
      };
      const token = localStorage.getItem("user");
      const response = await axios.get(`${API_BASE_URL}/api/admin/users`, {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Lỗi khi tải danh sách người dùng:", error);
      showToast("Không thể tải danh sách người dùng!", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filters, currentPage, pageSize]);


  const triggerDeleteUser = (user) => {
    setModalContent({
      title: "Xác nhận Xóa",
      message: `Bạn có chắc muốn xóa vĩnh viễn người dùng "${user.username}"?`,
      action: () => confirmDeleteUser(user.id),
      confirmButtonText: "Xóa ngay",
      confirmButtonClass: "btn-danger"
    });
    setIsModalOpen(true);
  };

  const confirmDeleteUser = async (userId) => {
    setIsModalOpen(false);
    try {
      const token = localStorage.getItem("user");
      await axios.delete(`http://localhost:8888/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast("Xóa người dùng thành công!", "success");
      setFilters({ ...filters });
    } catch (error) {
      console.error("Lỗi khi xóa user:", error);
      showToast("Không thể xóa người dùng!", "error");
    }
  };


  const triggerToggleStatus = (user, currentStatus) => {
    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const actionText = newStatus === "ACTIVE" ? "mở khóa" : "khóa";
    setModalContent({
      title: `Xác nhận ${actionText}`,
      message: `Bạn có muốn ${actionText} người dùng "${user.username}"?`,
      action: () => confirmToggleStatus(user.id),
      confirmButtonText: `${actionText}`,
      confirmButtonClass: "btn-warning"
    });
    setIsModalOpen(true);
  };

  const confirmToggleStatus = async (userId) => {
    setIsModalOpen(false);
    try {
      const token = localStorage.getItem("user");
      await axios.patch(
        `http://localhost:8888/api/admin/users/${userId}/toggle-status`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast("Cập nhật trạng thái thành công!", "success");
      setFilters({ ...filters });
    } catch (error) {
      console.error("Lỗi khi cập nhật status:", error);
      showToast("Không thể cập nhật trạng thái!", "error");
    }
  };

  const handleCloseModal = () => setIsModalOpen(false);
  const handleConfirmModal = () => modalContent.action && modalContent.action();

  return (
    <div className="user-container">
      {/* ← ← ← TOAST NOTIFICATION */}
      {toast.show && (
        <div className={`toast-notification ${toast.type}`}>
          {toast.type === "success" ? <FaCheckCircle /> : <FaTimesCircle />}
          <span>{toast.message}</span>
        </div>
      )}

      {isCreateModalOpen && (
        <div className="confirm-modal-overlay" onClick={() => setIsCreateModalOpen(false)}>
          <div className="confirm-modal-box create-user-modal" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-modal-header">
              <FaPlus /> Tạo User Mới
            </div>
            
            <div className="confirm-modal-body">
              <div className="form-row">
                <label>Username <span className="required">*</span></label>
                <input
                  type="text"
                  value={createForm.username}
                  onChange={(e) => setCreateForm({...createForm, username: e.target.value})}
                  placeholder="Nhập username..."
                />
              </div>

              <div className="form-row">
                <label>Email <span className="required">*</span></label>
                <input
                  type="email"
                  value={createForm.email}
                  onChange={(e) => setCreateForm({...createForm, email: e.target.value})}
                  placeholder="email@example.com"
                />
              </div>

              <div className="form-row">
                <label>Password <span className="required">*</span></label>
                <input
                  type="password"
                  value={createForm.password}
                  onChange={(e) => setCreateForm({...createForm, password: e.target.value})}
                  placeholder="Nhập password..."
                />
              </div>

              <div className="form-row">
                <label>Họ tên</label>
                <input
                  type="text"
                  value={createForm.fullName}
                  onChange={(e) => setCreateForm({...createForm, fullName: e.target.value})}
                  placeholder="Nguyễn Văn A"
                />
              </div>

              <div className="form-row">
                <label>Số điện thoại</label>
                <input
                  type="text"
                  value={createForm.phoneNumber}
                  onChange={(e) => setCreateForm({...createForm, phoneNumber: e.target.value})}
                  placeholder="0901234567"
                />
              </div>

              <div className="form-row">
                <label>Role <span className="required">*</span></label>
                <div className="role-radios">
                  {availableRoles.map(role => (
                    <label key={role} className="role-radio">
                      <input
                        type="radio"
                        name="role"
                        checked={createForm.roles[0] === role}
                        onChange={() => setCreateForm({...createForm, roles: [role]})}
                      />
                      <span className="radio-custom"></span>
                      <span className="role-label">{role.replace('ROLE_', '')}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="confirm-modal-actions">
              <button className="btn-secondary" onClick={() => setIsCreateModalOpen(false)}>
                Hủy
              </button>
              <button className="btn-primary" onClick={handleCreateUser}>
                <FaCheckCircle /> Tạo User
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditRoleModalOpen && (
        <div className="confirm-modal-overlay" onClick={() => setIsEditRoleModalOpen(false)}>
          <div className="confirm-modal-box edit-role-modal" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-modal-header">
              <FaEdit /> Sửa Role User
            </div>
            
            <div className="confirm-modal-body">
              <div className="user-info-box">
                <strong>Username:</strong> {editRoleForm.username}
                <br />
                <strong>Role hiện tại:</strong> 
                <span className={`role-badge ${editRoleForm.currentRole.toLowerCase()}`}>
                  {editRoleForm.currentRole.replace('ROLE_', '')}
                </span>
              </div>

              <div className="form-row">
                <label>Role mới <span className="required">*</span></label>
                <div className="role-radios">
                  {availableRoles.map(role => (
                    <label key={role} className="role-radio">
                      <input
                        type="radio"
                        name="newRole"
                        checked={editRoleForm.newRole === role}
                        onChange={() => setEditRoleForm({...editRoleForm, newRole: role})}
                      />
                      <span className="radio-custom"></span>
                      <span className="role-label">{role.replace('ROLE_', '')}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="confirm-modal-actions">
              <button className="btn-secondary" onClick={() => setIsEditRoleModalOpen(false)}>
                Hủy
              </button>
              <button 
                className="btn-primary" 
                onClick={handleEditRole}
                disabled={editRoleForm.newRole === editRoleForm.currentRole}
              >
                <FaCheckCircle /> Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL */}
      {isModalOpen && (
        <div className="confirm-modal-overlay" onClick={handleCloseModal}>
          <div className="confirm-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-modal-header">
              <h3>{modalContent.title}</h3>
            </div>
            <div className="confirm-modal-body">
              <p>{modalContent.message}</p>
            </div>
            <div className="confirm-modal-actions">
              <button className="btn-secondary" onClick={handleCloseModal}>Hủy</button>
              <button className={modalContent.confirmButtonClass} onClick={handleConfirmModal}>
                {modalContent.confirmButtonText}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BỘ LỌC */}
      <div className="filters-content">
        <div className="filters-title" onClick={() => setOpenFilter(!openFilter)}>
          <span>BỘ LỌC TÌM KIẾM</span>
          {!openFilter ? <FaChevronDown /> : <FaChevronUp />}
        </div>

        <div className={`filters-items ${openFilter ? "open" : "close"}`}>
          <div className="item">
            <label>ID User</label>
            <input
              type="text"
              placeholder="Nhập ID..."
              value={filters.id}
              onChange={(e) => handleFiltersChange("id", e.target.value.trim())}
            />
          </div>

          <div className="item">
            <label>TÊN ĐĂNG NHẬP</label>
            <input
              type="text"
              placeholder="Nhập username..."
              value={filters.username}
              onChange={(e) => handleFiltersChange("username", e.target.value.trim())}
            />
          </div>

          <div className="item">
            <label>EMAIL</label>
            <input
              type="text"
              placeholder="Nhập email..."
              value={filters.email}
              onChange={(e) => handleFiltersChange("email", e.target.value.trim())}
            />
          </div>

          <div className="item">
            <label>HỌ TÊN</label>
            <input
              type="text"
              placeholder="Nhập họ tên..."
              value={filters.fullname}
              onChange={(e) => handleFiltersChange("fullname", e.target.value.trim())}
            />
          </div>

          <div className="item">
            <label>VAI TRÒ</label>
            <select value={filters.role} onChange={(e) => handleFiltersChange("role", e.target.value)}>
              <option value="">Tất cả</option>
              <option value="ROLE_ADMIN">Admin</option>
              <option value="ROLE_USER">User</option>
            </select>
          </div>

          <div className="item">
            <label>TRẠNG THÁI</label>
            <select value={filters.status} onChange={(e) => handleFiltersChange("status", e.target.value)}>
              <option value="">Tất cả</option>
              <option value="ACTIVE">Hoạt động</option>
              <option value="INACTIVE">Tạm khóa</option>
              <option value="BANNED">Bị cấm</option>
            </select>
          </div>
        </div>

        {openFilter && (
          <div style={{ marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '15px', textAlign: 'right' }}>
            <button className="btn-clear" onClick={handleResetFilters}>Xóa bộ lọc</button>
          </div>
        )}
      </div>

      {/* BẢNG NGƯỜI DÙNG */}
      <div className="show-users">
        <div className="show-users_header">
          <h2>Quản lý User</h2>
          <button className="btn-primary" onClick={() => setIsCreateModalOpen(true)}>
            <FaPlus /> Tạo User
          </button>
        </div>
        <div className="show-users_content">
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
              Đang tải dữ liệu...
            </div>
          ) : (
            <div className="table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Họ Tên</th>
                    <th>Vai Trò</th>
                    <th style={{textAlign: 'center'}}>Trạng Thái</th>
                    <th>Ngày Tạo</th>
                    <th style={{textAlign: 'center'}}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{textAlign: "center", padding: "40px", color: "#888"}}>
                        Không có dữ liệu
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id}>
                        <td data-label="ID"><b>#{user.id}</b></td>
                        <td data-label="Username">{user.username}</td>
                        <td data-label="Email">{user.email}</td>
                        <td data-label="Họ Tên">{user.fullName || "Chưa cập nhật"}</td>
                        <td data-label="Vai Trò">
                          {user.roles.map((role) => (
                            <span
                              key={role}
                              className={`role-badge ${
                                role === "ROLE_ADMIN" ? "admin" : "user"
                              }`}
                            >
                              {role === "ROLE_ADMIN" ? "Admin" : "User"}
                            </span>
                          ))}
                        </td>
                        <td data-label="Trạng Thái" style={{textAlign: 'center'}}>
                          <span className={`status-badge ${getUserStatus(user).toLowerCase()}`}>
                            {getUserStatus(user) === "ACTIVE"
                              ? "Hoạt động"
                              : getUserStatus(user) === "INACTIVE"
                              ? "Tạm khóa"
                              : "Bị cấm"}
                          </span>
                        </td>
                        <td data-label="Ngày Tạo">{formatDate(user.createdAt)}</td>
                        <td data-label="Hành động">
                          <div className="action-buttons">
                            <button
                              className="btn-action edit"
                              onClick={() => {
                                setEditRoleForm({
                                  userId: user.id,
                                  username: user.username,
                                  currentRole: user.roles[0]?.name || 'ROLE_USER',
                                  newRole: user.roles[0]?.name || 'ROLE_USER'
                                });
                                setIsEditRoleModalOpen(true);
                              }}
                              title="Sửa role"
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="btn-toggle-status"
                              onClick={() => triggerToggleStatus(user, getUserStatus(user))}
                              title={getUserStatus(user) === "ACTIVE" ? "Khóa" : "Mở khóa"}
                            >
                              {getUserStatus(user) === "ACTIVE" ? <FaLock /> : <FaUnlock />}
                            </button>
                            <button
                              className="btn-delete"
                              onClick={() => triggerDeleteUser(user)}
                              title="Xóa"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Trước
              </button>
              <span>Trang {currentPage} / {totalPages}</span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Sau
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
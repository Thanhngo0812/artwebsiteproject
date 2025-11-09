import React, { useEffect, useState } from "react";
import "../admin/css/User.scss";
import { FaChevronUp, FaChevronDown, FaEdit, FaTrash, FaLock, FaUnlock } from "react-icons/fa";

export default function User() {
  const [openFilter, setOpenFilter] = useState(true);
  const handleCloseFilter = () => setOpenFilter(!openFilter);

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

  const handleResetFilters = () => {
    setFilters({
      id: "",
      username: "",
      email: "",
      fullname: "",
      role: "",
      status: "",
    });
  };

  const handleFiltersChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
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

        // TODO: Gọi API lấy danh sách users
        // const response = await axios.get('http://localhost:8888/api/admin/users', { params });
        // setUsers(response.data.content);
        // setTotalPages(response.data.totalPages);

        // Mock data để test
        setUsers([
          {
            id: 1,
            username: "user001",
            email: "user001@example.com",
            fullname: "Nguyễn Văn A",
            role: "USER",
            status: "ACTIVE",
            createdAt: "2024-01-15",
            lastLogin: "2024-11-05",
          },
          {
            id: 2,
            username: "user002",
            email: "user002@example.com",
            fullname: "Trần Thị B",
            role: "USER",
            status: "ACTIVE",
            createdAt: "2024-02-20",
            lastLogin: "2024-11-04",
          },
          {
            id: 3,
            username: "admin001",
            email: "admin@example.com",
            fullname: "Admin User",
            role: "ADMIN",
            status: "ACTIVE",
            createdAt: "2024-01-01",
            lastLogin: "2024-11-05",
          },
        ]);
        setTotalPages(1);
      } catch (error) {
        console.error("Lỗi khi tải danh sách người dùng:", error);
      }
    };

    fetchUsers();
  }, [filters, currentPage, pageSize]);

  const handleEditUser = (userId) => {
    console.log("Edit user:", userId);
    // TODO: Mở modal hoặc navigate đến trang edit
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      console.log("Delete user:", userId);
      // TODO: Gọi API xóa user
    }
  };

  const handleToggleStatus = (userId, currentStatus) => {
    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    console.log("Toggle status:", userId, newStatus);
    // TODO: Gọi API cập nhật status
  };

  return (
    <div className="user-container">
      <div className="filters-content">
        <div className="filters-title" onClick={handleCloseFilter}>
          BỘ LỌC{" "}
          <span>
            {!openFilter ? (
              <FaChevronDown className="open-close-icon" />
            ) : (
              <FaChevronUp className="open-close-icon" />
            )}
          </span>
        </div>

        <div className="clear-container">
          <button className="btn-clear" onClick={handleResetFilters}>
            Xóa Bộ Lọc
          </button>
        </div>

        <div className={`filters-items ${openFilter ? "open" : "close"}`}>
          <div className="id-item item">
            <div className="id-item_title">ID</div>
            <input
              className="id-item_input"
              type="text"
              placeholder="Nhập ID..."
              value={filters.id}
              onChange={(e) => handleFiltersChange("id", e.target.value.trim())}
            />
          </div>

          <div className="username-item item">
            <div className="username-item_title">TÊN ĐĂNG NHẬP</div>
            <input
              className="username-item_input"
              type="text"
              placeholder="Nhập username..."
              value={filters.username}
              onChange={(e) =>
                handleFiltersChange("username", e.target.value.trim())
              }
            />
          </div>

          <div className="email-item item">
            <div className="email-item_title">EMAIL</div>
            <input
              className="email-item_input"
              type="text"
              placeholder="Nhập email..."
              value={filters.email}
              onChange={(e) => handleFiltersChange("email", e.target.value.trim())}
            />
          </div>

          <div className="fullname-item item">
            <div className="fullname-item_title">HỌ TÊN</div>
            <input
              className="fullname-item_input"
              type="text"
              placeholder="Nhập họ tên..."
              value={filters.fullname}
              onChange={(e) =>
                handleFiltersChange("fullname", e.target.value.trim())
              }
            />
          </div>

          <div className="role-item item">
            <div className="role-item_title">VAI TRÒ</div>
            <select
              className="role-combobox"
              value={filters.role}
              onChange={(e) => handleFiltersChange("role", e.target.value)}
            >
              <option value="">Tất cả</option>
              <option value="ADMIN">Admin</option>
              <option value="USER">User</option>
            </select>
          </div>

          <div className="status-item item">
            <div className="status-item_title">TRẠNG THÁI</div>
            <select
              className="status-combobox"
              value={filters.status}
              onChange={(e) => handleFiltersChange("status", e.target.value)}
            >
              <option value="">Tất cả</option>
              <option value="ACTIVE">Hoạt động</option>
              <option value="INACTIVE">Tạm khóa</option>
              <option value="BANNED">Bị cấm</option>
            </select>
          </div>
        </div>
      </div>

      <div className="show-users">
        <div className="show-users_title">DANH SÁCH NGƯỜI DÙNG</div>
        <div className="show-users_content">
          <div className="table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Họ Tên</th>
                  <th>Vai Trò</th>
                  <th>Trạng Thái</th>
                  <th>Ngày Tạo</th>
                  <th>Đăng Nhập Gần Nhất</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="no-data">
                      Không có dữ liệu
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>{user.fullname}</td>
                      <td>
                        <span className={`role-badge ${user.role.toLowerCase()}`}>
                          {user.role === "ADMIN" ? "Admin" : "User"}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${user.status.toLowerCase()}`}>
                          {user.status === "ACTIVE"
                            ? "Hoạt động"
                            : user.status === "INACTIVE"
                            ? "Tạm khóa"
                            : "Bị cấm"}
                        </span>
                      </td>
                      <td>{formatDate(user.createdAt)}</td>
                      <td>{formatDate(user.lastLogin)}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-edit"
                            onClick={() => handleEditUser(user.id)}
                            title="Chỉnh sửa"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn-toggle-status"
                            onClick={() => handleToggleStatus(user.id, user.status)}
                            title={user.status === "ACTIVE" ? "Khóa" : "Mở khóa"}
                          >
                            {user.status === "ACTIVE" ? <FaLock /> : <FaUnlock />}
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => handleDeleteUser(user.id)}
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Trước
              </button>
              <span>
                Trang {currentPage} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
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
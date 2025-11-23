import React, { useState, useEffect, useRef } from "react";
import "./Category.scss";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash, FaFolder, FaFolderOpen, FaTimes, FaSave } from "react-icons/fa";
import { toast } from "react-toastify";

// API Base URL
const API_BASE_URL = "http://localhost:8888/api/v1";

export default function Category() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const [selectedParent, setSelectedParent] = useState(null);

    const [isParentModalOpen, setIsParentModalOpen] = useState(false);
    const [parentForm, setParentForm] = useState({ id: null, name: "" });

    const [childName, setChildName] = useState("");
    const [editingChildId, setEditingChildId] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            // Giả sử endpoint này trả về cấu trúc cây danh mục
            const response = await axios.get(`${API_BASE_URL}/filters/products`);
            if (response.data && response.data.categories) {
                setCategories(response.data.categories);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast.error("Không thể tải danh sách danh mục.");
        } finally {
            setLoading(false);
        }
    };

    // --- XỬ LÝ PARENT CATEGORY ---

    const handleOpenAddParent = () => {
        setParentForm({ id: null, name: "" });
        setIsParentModalOpen(true);
    };

    const handleOpenEditParent = (e, category) => {
        e.stopPropagation();
        setParentForm({ id: category.id, name: category.name });
        setIsParentModalOpen(true);
    };

    const handleSaveParent = async () => {
        if (!parentForm.name.trim()) {
            toast.warning("Tên danh mục không được để trống!");
            return;
        }

        try {
            if (parentForm.id) {
                await axios.put(`${API_BASE_URL}/categories/${parentForm.id}`, { name: parentForm.name });
                toast.success("Cập nhật danh mục thành công");
                setCategories(prev => prev.map(c => c.id === parentForm.id ? { ...c, name: parentForm.name } : c));
            } else {
                await axios.post(`${API_BASE_URL}/categories`, { name: parentForm.name, parentId: null });
                toast.success("Thêm danh mục cha thành công");
                setCategories(prev => [...prev, { id: Date.now(), name: parentForm.name, children: [] }]);
            }
            setIsParentModalOpen(false);
            fetchCategories();
        } catch (error) {
            toast.error("Có lỗi xảy ra khi lưu danh mục.");
        }
    };

    const handleDeleteParent = async (e, id) => {
        e.stopPropagation();
        if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này và tất cả danh mục con của nó?")) {
            try {
                await axios.delete(`${API_BASE_URL}/categories/${id}`);
                toast.success("Xóa danh mục thành công");
                setCategories(prev => prev.filter(c => c.id !== id));
            } catch (error) {
                toast.error("Có lỗi xảy ra khi xóa.");
            }
        }
    };

    // --- XỬ LÝ CHILD CATEGORY ---

    const handleOpenChildModal = (category) => {
        setSelectedParent(category);
        setChildName("");
        setEditingChildId(null);
    };

    const handleCloseChildModal = () => {
        setSelectedParent(null);
    };

    const handleSaveChild = async () => {
        if (!childName.trim()) {
            toast.warning("Tên danh mục con không được để trống!");
            return;
        }

        try {
            if (editingChildId) {
                // Sửa
                await axios.put(`${API_BASE_URL}/categories/${editingChildId}`, { name: childName });
                toast.success("Cập nhật danh mục con thành công");

                // Update local state
                const updatedChildren = selectedParent.children.map(c =>
                    c.id === editingChildId ? { ...c, name: childName } : c
                );
                const updatedParent = { ...selectedParent, children: updatedChildren };

                setSelectedParent(updatedParent);
                setCategories(prev => prev.map(p => p.id === selectedParent.id ? updatedParent : p));

                setEditingChildId(null);
            } else {
                // Thêm mới
                await axios.post(`${API_BASE_URL}/categories`, { name: childName, parentId: selectedParent.id });
                toast.success("Thêm danh mục con thành công");

                // Update local state
                const newChild = { id: Date.now(), name: childName };
                const updatedParent = { ...selectedParent, children: [...selectedParent.children, newChild] };

                setSelectedParent(updatedParent);
                setCategories(prev => prev.map(p => p.id === selectedParent.id ? updatedParent : p));
            }
            setChildName("");
        } catch (error) {
            toast.error("Lỗi khi lưu danh mục con.");
        }
    };

    const handleEditChild = (child) => {
        setChildName(child.name);
        setEditingChildId(child.id);
    };

    const handleCancelEditChild = () => {
        setChildName("");
        setEditingChildId(null);
    };

    const handleDeleteChild = async (childId) => {
        if (window.confirm("Xóa danh mục con này?")) {
            try {
                await axios.delete(`${API_BASE_URL}/categories/${childId}`);
                toast.success("Đã xóa danh mục con");

                const updatedChildren = selectedParent.children.filter(c => c.id !== childId);
                const updatedParent = { ...selectedParent, children: updatedChildren };

                setSelectedParent(updatedParent);
                setCategories(prev => prev.map(p => p.id === selectedParent.id ? updatedParent : p));
            } catch (error) {
                toast.error("Lỗi khi xóa.");
            }
        }
    };

    return (
        <div className="category-manager">
            <div className="header-actions">
                <h2>Quản Lý Danh Mục</h2>
                <button className="btn-add-parent" onClick={handleOpenAddParent}>
                    <FaPlus /> Thêm Danh Mục
                </button>
            </div>

            {loading ? (
                <div className="loading">Đang tải...</div>
            ) : (
                <div className="category-grid">
                    {categories.map(category => (
                        <div key={category.id} className="category-card" onClick={() => handleOpenChildModal(category)}>
                            <div className="card-icon">
                                <FaFolderOpen />
                            </div>
                            <div className="card-info">
                                <h3>{category.name}</h3>
                                <p>{category.children ? category.children.length : 0} danh mục con</p>
                            </div>
                            <div className="card-actions">
                                <button className="btn-icon edit" onClick={(e) => handleOpenEditParent(e, category)} title="Sửa tên">
                                    <FaEdit />
                                </button>
                                <button className="btn-icon delete" onClick={(e) => handleDeleteParent(e, category.id)} title="Xóa">
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* MODAL THÊM/SỬA PARENT */}
            {isParentModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content small">
                        <div className="modal-header">
                            <h3>{parentForm.id ? "Cập Nhật Danh Mục" : "Thêm Danh Mục Mới"}</h3>
                            <button className="close-btn" onClick={() => setIsParentModalOpen(false)}><FaTimes /></button>
                        </div>
                        <div className="modal-body">
                            <input
                                type="text"
                                placeholder="Tên danh mục..."
                                value={parentForm.name}
                                onChange={(e) => setParentForm({ ...parentForm, name: e.target.value })}
                                autoFocus
                            />
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setIsParentModalOpen(false)}>Hủy</button>
                            <button className="btn-save" onClick={handleSaveParent}>Lưu</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL QUẢN LÝ CHILD CATEGORIES */}
            {selectedParent && (
                <div className="modal-overlay">
                    <div className="modal-content large">
                        <div className="modal-header">
                            <h3>Danh mục con: <span className="highlight">{selectedParent.name}</span></h3>
                            <button className="close-btn" onClick={handleCloseChildModal}><FaTimes /></button>
                        </div>

                        <div className="modal-body">
                            {/* Form thêm/sửa child */}
                            <div className="child-form">
                                <input
                                    type="text"
                                    placeholder="Nhập tên danh mục con..."
                                    value={childName}
                                    onChange={(e) => setChildName(e.target.value)}
                                />
                                <button className="btn-save-child" onClick={handleSaveChild}>
                                    {editingChildId ? <><FaSave /> Cập nhật</> : <><FaPlus /> Thêm</>}
                                </button>
                                {editingChildId && (
                                    <button className="btn-cancel-edit" onClick={handleCancelEditChild}>Hủy</button>
                                )}
                            </div>

                            {/* Danh sách child */}
                            <div className="child-list-container">
                                <table className="child-table">
                                    <thead>
                                        <tr>

                                            <th>Tên Danh Mục</th>
                                            <th className="text-right">Hành Động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedParent.children && selectedParent.children.length > 0 ? (
                                            selectedParent.children.map(child => (
                                                <tr key={child.id} className={editingChildId === child.id ? "editing" : ""}>

                                                    <td>{child.name}</td>
                                                    <td className="text-right">
                                                        <button className="btn-action edit" onClick={() => handleEditChild(child)}>
                                                            <FaEdit />
                                                        </button>
                                                        <button className="btn-action delete" onClick={() => handleDeleteChild(child.id)}>
                                                            <FaTrash />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="empty-text">Chưa có danh mục con nào.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
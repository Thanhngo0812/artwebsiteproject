import React, { useState, useEffect, useRef } from "react";
import "./css/Category.scss";
import axios from "axios";
import { FaTimes, FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

export default function Category() {
  const [listCategory, setListCategory] = useState([]);
  const [openParentId, setOpenParentId] = useState(null);

  useEffect(() => {
    const fetchListCategory = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8888/api/v1/filters/products"
        );
        setListCategory(response.data.categories);
      } catch (error) {
        console.log("Lỗi khi gọi api: ", error);
      }
    };
    fetchListCategory();
  }, []);

  const handleToggle = (id) => {
    setOpenParentId(openParentId === id ? null : id);
  };

  const [openInputAdd, setOpenInputAdd] = useState(false);
  const handleOpenInput = () => {
    setOpenInputAdd(!openInputAdd);
  };
  const [nameAdd, setNameAdd] = useState("");
  const handleChangeAddInput = (e) => {
    setNameAdd(e.target.value);
  };
  const addInputRef = useRef(null);
  const handleAddCategory = () => {
    if (!nameAdd.trim()) {
      toast.warning("Không được để trống!");
      setNameAdd("");
      if (addInputRef.current) {
        addInputRef.current.focus();
      }
      return;
    }
    // gọi api thêm mới
    setNameAdd("");
    setOpenInputAdd(false);
  };

  const [openInputEdit, setOpenInputEdit] = useState(null);
  const [editName, setEditName] = useState("");
  const editInputRef = useRef(null);

  const handleOpenEdit = (childId, currentName) => {
    if (openInputEdit === childId) {
      setOpenInputEdit(null);
      setEditName("");
    } else {
      setOpenInputEdit(childId);
      setEditName(currentName);
    }
  };

  const handleChangeEditInput = (e) => {
    setEditName(e.target.value);
  };

  const handleEditCategory = (childId) => {
    if (!editName.trim()) {
      toast.warning("Không được để trống!");
      setEditName("");
      if (editInputRef.current) {
        editInputRef.current.focus();
      }
      return;
    }
    // gọi api sửa
    console.log(`Cập nhật ID: ${childId} với tên mới: ${editName}`);
    setOpenInputEdit(null);
    setEditName("");
  };

  const handleDeleteCategory = (id) => {
    const confirmDel = window.confirm("Chắc chắn muốn xóa danh mục này chứ?");
    if (confirmDel) {
      console.log("xóa với id=", id);
      //gọi api xóa
    }
  };

  return (
    <div className="category-container">
      <div className="category-content">
        {listCategory &&
          listCategory.length > 0 &&
          listCategory.map((item, index) => (
            <div
              className={`category-parent-item ${
                openParentId === item.id ? "open" : ""
              }`}
              key={item.id}
              onClick={() => handleToggle(item.id)}
            >
              {item.name}

              {openParentId === item.id && item.children.length > 0 && (
                <div
                  className="category-child-item"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="category-child-item-content">
                    <div className="title">{item.name}</div>
                    <span
                      className="icon-close"
                      onClick={() => handleToggle(null)}
                    >
                      <FaTimes size={25} />
                    </span>
                    <table className="table-show">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {item.children.map((child, idx) => {
                          const isEditing = openInputEdit === child.id;
                          return (
                            <tr key={child.id}>
                              <td>{child.id}</td>
                              <td>
                                {isEditing ? (
                                  <div className="edit-category">
                                    <input
                                      ref={editInputRef}
                                      type="text"
                                      value={editName}
                                      onChange={handleChangeEditInput}
                                    />
                                    <button
                                      onClick={() =>
                                        handleEditCategory(child.id)
                                      }
                                    >
                                      Lưu
                                    </button>
                                  </div>
                                ) : (
                                  child.name
                                )}
                              </td>
                              <td>
                                <FaEdit
                                  size={20}
                                  style={{
                                    cursor: "pointer",
                                  }}
                                  onClick={() =>
                                    handleOpenEdit(child.id, child.name)
                                  }
                                />
                                <FaTrash
                                  style={{
                                    cursor: "pointer",
                                    marginLeft: "10px",
                                  }}
                                  onClick={() => handleDeleteCategory(child.id)}
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    <div className="btn-add-category">
                      <button onClick={handleOpenInput}>+ Thêm Mới</button>
                    </div>
                    {openInputAdd && (
                      <div className="add-new">
                        <input
                          ref={addInputRef}
                          type="text"
                          placeholder="Nhập danh mục mới..."
                          value={nameAdd}
                          onChange={handleChangeAddInput}
                        />
                        <button onClick={handleAddCategory}>Lưu</button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

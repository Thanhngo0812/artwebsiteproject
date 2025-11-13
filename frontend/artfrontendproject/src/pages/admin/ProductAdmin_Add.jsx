import React, { useState, useEffect, useCallback } from "react";
// import "./css/ProductAdmin.scss"; // Sẽ nhúng CSS vào file
import axios from "axios";
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify'; // Giả sử bạn đã cài react-toastify

// =======================================================
// MỚI: Bắt đầu các component/CSS tự chứa
// =======================================================

// 1. Component StyleInjector để nhúng CSS
const StyleInjector = ({ styles }) => {
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, [styles]);
  return null;
};

// 2. Component LoadingSpinner
const LoadingSpinner = ({ isLoading }) => {
  if (!isLoading) return null;
  return (
    <div className="loading-overlay">
      <div className="loading-spinner"></div>
    </div>
  );
};

// 3. Component FontAwesomeIcon và Icons (Giả lập)
// (Bao gồm các icon từ trang User.jsx và thêm icon mới)
const faChevronUp = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor"><path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"/></svg>
);
const faChevronDown = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
);
const faPlus = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="1em" height="1em" fill="currentColor"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>
);
const faTrash = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="1em" height="1em" fill="currentColor"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
);
const faTimes = ( // Icon X (đóng)
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="1em" height="1em" fill="currentColor"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
);


// Component Icon giả lập
const FontAwesomeIcon = ({ icon, style, onClick, className }) => {
  return (
    <span 
      style={{ ...style, display: 'inline-block', width: '1em', height: '1em', verticalAlign: 'middle', marginRight: '0px' }}
      onClick={onClick}
      className={className}
    >
      {icon}
    </span>
  );
};

// Giả lập ReactPaginate
const ReactPaginate = () => null; 
// =======================================================
// KẾT THÚC CÁC COMPONENT TỰ CHỨA
// =======================================================


// Giả sử API_BASE_URL của bạn
const API_BASE_URL = "http://localhost:8888";

// Hàm helper lấy token (Giả sử bạn lưu token trong localStorage)
const getAuthToken = () => {
    return localStorage.getItem('accessToken');
};

// Hàm helper để tạo header cho axios (chỉ cần token)
const createAuthHeaders = () => {
    const token = getAuthToken();
    if (token) {
        return { 
            'Authorization': `Bearer ${token}` 
        };
    }
    return {};
};

// (Giả sử bạn có file/hàm format tiền tệ)
const formatCurrency = (value) => {
    if (!value) return "0 ₫";
    return value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
};

// --- COMPONENT CHÍNH ---

export default function ProductAdmin_Add() {
  const [openFilter, setOpenFilter] = useState(true); // Luôn mở
  
  // State cho các lựa chọn (danh mục, chất liệu) trong bộ lọc
  const [filterData, setFilterData] = useState({ categories: [], materials: [] });

  // State chính cho Dữ liệu Sản phẩm
  const [productData, setProductData] = useState({
    productName: '',
    description: '',
    thumbnail: null, // SỬA: Lưu File object, không lưu URL
    materialId: '',
    // productStatus: 0, // ĐÃ XÓA (Backend tự set 0)
    categoryIds: new Set(),
    topics: [], 
    colors: [], 
  });
  // MỚI: State riêng cho preview
  const [thumbnailPreview, setThumbnailPreview] = useState(''); 

  // State cho các Phiên bản (Variants)
  const [variants, setVariants] = useState([]); 
  
  // State cho form "Phiên bản hiện tại"
  const [currentVariant, setCurrentVariant] = useState({
    tempId: null, 
    width: '',
    height: '',
    stockQuantity: '0', // SỬA: Mặc định là 0
    price: '0', 
    costPrice: '0', 
    images: [], // SỬA: Lưu mảng File objects
    imagePreviews: [], // MỚI: Lưu mảng URL preview
  });
  
  // =======================================================
  // SỬA: State cho input (Chủ đề và Màu)
  // =======================================================
  const [currentTopic, setCurrentTopic] = useState('');
  const [currentColor, setCurrentColor] = useState('#');
  const [colorError, setColorError] = useState('');
  const hexRegex = /^#(?:[0-9a-fA-F]{3}){1,2}$/; // Regex kiểm tra mã Hex
  // =======================================================
  // MỚI: State cho đóng/mở Danh mục
  // =======================================================
  const [openCategories, setOpenCategories] = useState([]);


  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // 1. Tải dữ liệu cho các bộ lọc (Dropdowns)
  useEffect(() => {
    const fetchFilterData = async () => {
        setIsLoading(true);
        try {
            const headers = createAuthHeaders();
            // TODO: API của bạn có thể khác (ví dụ: /api/v1/categories/hierarchical)
            const catResponse = await axios.get(`${API_BASE_URL}/api/v1/categories/allparents`, { headers });
            const matResponse = await axios.get(`${API_BASE_URL}/api/v1/materials/all`, { headers });
            
            const categoriesData = Array.isArray(catResponse.data) 
                ? catResponse.data 
                : (catResponse.data?.content || []);
                
            const materialsData = Array.isArray(matResponse.data) 
                ? matResponse.data 
                : (matResponse.data?.content || []); 

            setFilterData({
                categories: categoriesData,
                materials: materialsData
            });
            
            // MỚI: Tự động mở tất cả danh mục cha (nếu muốn)
            // const parentIds = categoriesData.map(cat => cat.id);
            // setOpenCategories(parentIds);

        } catch (error) {
            console.error("Lỗi khi tải dữ liệu filter:", error);
            toast.error("Lỗi tải danh mục/chất liệu.");
        } finally {
            setIsLoading(false);
        }
    };
    fetchFilterData();
  }, []);

  useEffect(() => {
    // Lưu trữ các URL hiện tại
    const currentThumbnailPreview = thumbnailPreview;
    const currentVariants = variants;
    const currentVariantPreviews = currentVariant.imagePreviews;

    // Hàm này chạy KHI component bị hủy (unmount)
    return () => {
      // Hủy URL preview của thumbnail
      if (currentThumbnailPreview) {
        URL.revokeObjectURL(currentThumbnailPreview);
      }
      // Hủy tất cả URL preview của các phiên bản (đã thêm)
      currentVariants.forEach(v => {
        v.imagePreviews.forEach(url => URL.revokeObjectURL(url));
      });
      // Hủy preview của phiên bản *đang nhập*
      currentVariantPreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, []); // <-- Mảng rỗng: Chỉ chạy 1 lần duy nhất khi unmount


  // --- XỬ LÝ CÁC INPUT CHÍNH ---

  // Xử lý các input text đơn giản
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Xử lý khi chọn file cho Thumbnail (Chỉ preview)
  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (thumbnailPreview) {
        URL.revokeObjectURL(thumbnailPreview);
    }
    setProductData(prev => ({ ...prev, thumbnail: file })); 
    setThumbnailPreview(URL.createObjectURL(file)); 
    e.target.value = null; 
  };

  // =======================================================
  // SỬA: Logic đóng/mở (toggle) Danh mục
  // =======================================================
  const toggleCategory = (categoryId) => {
    setOpenCategories((prevOpenCategories) => {
      // Nếu ID đã có trong mảng (đang mở)
      if (prevOpenCategories.includes(categoryId)) {
        // Loại bỏ ID (đóng)
        return prevOpenCategories.filter((id) => id !== categoryId);
      } else {
        // Thêm ID (mở)
        return [...prevOpenCategories, categoryId];
      }
    });
  };

  // Xử lý chọn Danh mục (Multi-select)
  const handleCategoryChange = (categoryId) => {
    setProductData(prev => {
        const newCategoryIds = new Set(prev.categoryIds);
        if (newCategoryIds.has(categoryId)) {
            newCategoryIds.delete(categoryId);
        } else {
            newCategoryIds.add(categoryId);
        }
        return { ...prev, categoryIds: newCategoryIds };
    });
    if (errors.categories) {
        setErrors(prev => ({ ...prev, categories: null }));
    }
  };

  // =======================================================
  // SỬA: Logic Thêm/Xóa cho Chủ đề (Topics)
  // =======================================================
  const handleAddTopic = () => {
    const trimmedTopic = currentTopic.trim();
    if (trimmedTopic === '') return; // Không thêm nếu rỗng
    if (productData.topics.includes(trimmedTopic)) { // Không thêm nếu trùng
        toast.warn("Chủ đề này đã được thêm.");
        return;
    }
    setProductData(prev => ({ 
        ...prev, 
        topics: [...prev.topics, trimmedTopic] 
    }));
    setCurrentTopic(''); // Reset ô input
  };
  
  const handleRemoveTopic = (topicToRemove) => {
    setProductData(prev => ({
        ...prev,
        topics: prev.topics.filter(t => t !== topicToRemove)
    }));
  };
  
  // =======================================================
  // SỬA: Logic Thêm/Xóa cho Màu sắc (Colors)
  // =======================================================
  const handleColorInputChange = (e) => {
      const value = e.target.value;
      setCurrentColor(value);
      // Kiểm tra validation
      if (value === '#') {
          setColorError('');
      } else if (!hexRegex.test(value)) {
          setColorError("Định dạng hex không hợp lệ (ví dụ: #FF0000 hoặc #F00)");
      } else {
          setColorError(''); // Hợp lệ
      }
  };

  const handleAddColor = () => {
    const trimmedColor = currentColor.trim().toUpperCase();
    if (trimmedColor === '#') return; // Rỗng
    if (!hexRegex.test(trimmedColor)) {
        toast.error("Mã màu không hợp lệ.");
        return;
    }
    if (productData.colors.includes(trimmedColor)) {
        toast.warn("Màu này đã được thêm.");
        return;
    }
    setProductData(prev => ({ 
        ...prev, 
        colors: [...prev.colors, trimmedColor] 
    }));
    setCurrentColor('#'); // Reset ô input
    setColorError('');
  };

  const handleRemoveColor = (colorToRemove) => {
    setProductData(prev => ({
        ...prev,
        colors: prev.colors.filter(c => c !== colorToRemove)
    }));
  };

  // --- XỬ LÝ FORM PHIÊN BẢN (VARIANT) ---

  const handleVariantChange = (e) => {
    const { name, value } = e.target;
    // SỬA: Tồn kho (stockQuantity) không cho phép sửa (đã bị disabled)
    // Chỉ cho phép sửa width/height
    if (name === 'width' || name === 'height') {
        const numericValue = value.replace(/[^0-9]/g, '');
        setCurrentVariant(prev => ({ ...prev, [name]: numericValue }));
    } else {
        setCurrentVariant(prev => ({ ...prev, [name]: value }));
    }
  };

  // Xử lý khi chọn file cho Variant (Chỉ preview)
  const handleVariantImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const newFileArray = [...currentVariant.images, file];
    const newPreviewArray = [...currentVariant.imagePreviews, URL.createObjectURL(file)];

    setCurrentVariant(prev => ({
        ...prev,
        images: newFileArray,
        imagePreviews: newPreviewArray
    }));
    e.target.value = null;
  };
  
  const handleVariantImageRemove = (indexToRemove) => {
     URL.revokeObjectURL(currentVariant.imagePreviews[indexToRemove]);
     setCurrentVariant(prev => ({
        ...prev,
        images: prev.images.filter((_, index) => index !== indexToRemove),
        imagePreviews: prev.imagePreviews.filter((_, index) => index !== indexToRemove)
     }));
  };
  
  // Thêm phiên bản hiện tại vào danh sách
  const handleAddVariant = () => {
    const { width, height, images } = currentVariant; // Xóa stockQuantity

    // Validation
    if (!width || !height) { 
        toast.error("Vui lòng nhập Chiều dài và Chiều rộng.");
        return;
    }
    if (images.length === 0) {
        toast.error("Phiên bản phải có ít nhất 1 ảnh.");
        return;
    }

    const newVariant = {
        ...currentVariant,
        tempId: Date.now(),
        dimensions: `${width}x${height}`, 
        price: 0, 
        costPrice: 0,
        stockQuantity: 0 // SỬA: Luôn là 0
    };

    setVariants(prev => [...prev, newVariant]);
    
    // Reset form phiên bản
    setCurrentVariant({
        tempId: null,
        width: '',
        height: '',
        stockQuantity: '0', // SỬA: Mặc định là 0
        price: '0',
        costPrice: '0',
        images: [],
        imagePreviews: [], // Reset cả preview
    });
    
    if (errors.variants) {
        setErrors(prev => ({ ...prev, variants: null }));
    }
  };

  // Xóa một phiên bản khỏi danh sách
  const handleRemoveVariant = (tempId) => {
    // Tìm phiên bản sắp xóa để hủy URL preview
    const variantToRemove = variants.find(v => v.tempId === tempId);
    if (variantToRemove) {
        variantToRemove.imagePreviews.forEach(url => URL.revokeObjectURL(url));
    }
    setVariants(prev => prev.filter(v => v.tempId !== tempId));
  };


  // --- XỬ LÝ SUBMIT CHÍNH ---

  // =======================================================
  // SỬA: Cập nhật hàm validation (thêm 'description')
  // =======================================================
  const validateForm = () => {
    const newErrors = {};
    if (!productData.productName.trim()) newErrors.productName = "Tên sản phẩm không được để trống.";
    if (!productData.description.trim()) newErrors.description = "Mô tả không được để trống."; // <-- THÊM
    if (!productData.materialId) newErrors.materialId = "Vui lòng chọn một chất liệu.";
    if (productData.categoryIds.size === 0) newErrors.categories = "Vui lòng chọn ít nhất một danh mục.";
    if (variants.length === 0) newErrors.variants = "Sản phẩm phải có ít nhất một phiên bản (kích thước).";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Trả về true nếu không có lỗi
  };

  // =======================================================
  // SỬA: handleSubmit (Gửi FormData, bỏ stockQuantity)
  // =======================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
        toast.error("Vui lòng điền đầy đủ các trường bắt buộc.");
        return;
    }
    
    setIsLoading(true);

    // 1. Tạo FormData
    const formData = new FormData();

    // 2. Tạo đối tượng DTO (nhưng chỉ chứa data, không chứa file)
    const dtoPayload = {
        productName: productData.productName,
        description: productData.description,
        materialId: productData.materialId,
        
        categories: Array.from(productData.categoryIds).map(id => ({ id: id })),
        topics: productData.topics.map(name => ({ topicName: name })),
        colors: productData.colors.map(hex => ({ hexCode: hex })),

        // Map lại các phiên bản
        variants: variants.map(v => ({
            dimensions: v.dimensions,
            price: v.price,
            costPrice: v.costPrice,
            // stockQuantity: ĐÃ XÓA (Backend tự set 0)
            variantStatus: 1, // Mặc định là 1 (Active)
            
            // SỬA: Gửi số lượng ảnh (để backend biết map)
            imageCount: v.images.length
        }))
    };
    
    // 3. Gắn DTO (dưới dạng "part" JSON)
    formData.append('dto', new Blob([JSON.stringify(dtoPayload)], {
      type: "application/json"
    }));

    // 4. Gắn file Thumbnail (nếu có)
    if (productData.thumbnail) {
        formData.append('thumbnailFile', productData.thumbnail, productData.thumbnail.name);
    }

    // 5. Gắn file của các Phiên bản
    // QUAN TRỌNG: Chúng ta phải gửi theo đúng thứ tự
    variants.forEach((variant) => {
        variant.images.forEach((file) => {
            formData.append('variantFiles', file, file.name); 
        });
    });
//     const dtoBlob = formData.get('dto');
// dtoBlob.text().then(text => {
//   console.log('DTO JSON:', JSON.parse(text));
// });

//     setIsLoading(false)
    try {
        // API (POST /api/v1/admin/products)
        await axios.post(`${API_BASE_URL}/api/v1/admin/products`, formData, {
            headers: {
                ...createAuthHeaders(),
                'Content-Type': 'multipart/form-data' 
            }
        });

        toast.success("Thêm sản phẩm mới thành công!");
        navigate('/admin/product'); // Quay lại trang danh sách

    } catch (error) {
        console.error("Lỗi khi thêm sản phẩm:", error);
        toast.error(error.response?.data?.message || "Lỗi không xác định khi thêm sản phẩm.");
    } finally {
        setIsLoading(false);
    }
  };


  // --- CSS (Giống ProductAdmin.jsx nhưng thêm style cho form) ---
  const allStyles = `
    .product-admin-container {
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f4f7fa;
    }
    
    /* 1. Đổi tên .filters-content thành .form-container */
    .form-container {
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      padding: 20px;
      margin-bottom: 20px;
    }
    
    /* Grid layout cho form */
    .form-grid {
      display: grid;
      /* 2 cột */
      grid-template-columns: repeat(auto-fill, minmax(300px,500px));
      gap: 20px;
    }
    
    /* CSS cho các item (giống .filters-items .item) */
    .form-item {
      margin-bottom: 15px;
    }
    .form-item label {
      font-size: 0.85rem;
      font-weight: 600;
      color: #555;
      margin-bottom: 8px;
      text-transform: uppercase;
      display: block;
    }
    .form-item input[type="text"],
    .form-item input[type="url"],
    .form-item input[type="number"],
    .form-item select,
    .form-item textarea {
      width: 100%;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
      font-size: 1rem;
      box-sizing: border-box;
    }
    /* SỬA: Thêm style cho input[disabled] */
    .form-item input[disabled] {
        background: #eee;
        color: #777;
        cursor: not-allowed;
    }
    .form-item textarea {
        min-height: 100px;
        resize: vertical;
    }
    .form-item input:focus,
    .form-item select:focus,
    .form-item textarea:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.2);
    }
    
    /* CSS cho trường bị lỗi (validation) */
    .form-item .input-error {
        border-color: #dc3545;
    }
    .error-message {
        color: #dc3545;
        font-size: 0.85rem;
        margin-top: 5px;
    }

    /* ================================== */
    /* SỬA: CSS cho Danh mục (Phân cấp) */
    /* ================================== */
    .checkbox-group {
        max-height: 250px; /* Tăng chiều cao */
        overflow-y: auto;
        border: 1px solid #ddd;
        border-radius: 5px;
        padding: 0; /* Xóa padding gốc */
    }
    .category-item-container {
        border-bottom: 1px solid #f0f0f0;
    }
    .category-item-container:last-child {
        border-bottom: none;
    }
    .category-parent-row {
        display: flex;
        align-items: center;
        padding: 10px;
        cursor: pointer;
        background-color: #f9f9f9;
    }
    .category-parent-row:hover {
        background-color: #f0f0f0;
    }
    .category-parent-row input[type="checkbox"] {
        margin-right: 8px;
        margin-left: 5px;
    }
    /* Ghi đè style của .checkbox-item label */
    .category-parent-row span {
        font-weight: bold;
        text-transform: none;
        margin: 0;
        cursor: pointer;
    }
    
    .category-child-list {
        padding-left: 30px; /* Thụt lề cho con */
        background-color: #fff;
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease-in-out;
    }
    .category-child-list.open {
        max-height: 500px; /* Chiều cao tối đa khi mở */
    }
    .category-child-list .checkbox-item {
         padding: 8px 10px;
         border-top: 1px solid #f5f5f5;
    }
    .checkbox-item {
        display: block;
        margin-bottom: 8px;
    }
    .checkbox-item input {
        margin-right: 8px;
    }
    .checkbox-item label {
        font-weight: normal;
        text-transform: none;
    }
    
    /* ================================== */
    /* SỬA: CSS cho nhập tag (Topics, Colors) */
    /* ================================== */
    .tag-input-group {
        display: flex;
        gap: 10px;
    }
    .tag-input-group input {
        flex-grow: 1;
    }
    .btn-add-tag {
        padding: 10px 15px;
        border: 1px solid #007bff;
        border-radius: 6px;
        background-color: #e0f0ff;
        color: #007bff;
        font-size: 0.9rem;
        font-weight: 600;
        cursor: pointer;
        white-space: nowrap; /* Không xuống dòng */
    }
    
    /* Preview (chung) */
    .tag-input-preview {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 10px;
        min-height: 20px; /* Giữ chỗ */
    }
    /* Preview Chủ đề (Topic) */
    .tag-item-wrapper {
        display: flex;
        align-items: center;
        background-color: #f0f0f0;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 3px 8px;
        font-size: 0.9rem;
    }
    /* Preview Màu (Color) */
    .color-tag-item {
        display: flex;
        align-items: center;
        background-color: #f0f0f0;
        border: 1px solid #ddd;
        border-radius: 15px; /* Bo tròn */
        padding: 3px 8px;
        font-size: 0.9rem;
    }
    .color-swatch-preview {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 1px solid #ccc;
        margin-right: 5px;
    }
    .tag-remove-btn {
        margin-left: 8px;
        color: #777;
        cursor: pointer;
    }
    .tag-remove-btn:hover {
        color: #dc3545;
    }
    /* ================================== */
    /* KẾT THÚC SỬA CSS TAGS */
    /* ================================== */


    /* CSS cho Nút Submit (Lưu, Hủy) */
    .form-actions {
      display: flex;
      gap: 10px;
      margin-top: 20px;
      border-top: 1px solid #eee;
      padding-top: 20px;
    }
    .btn-primary {
      padding: 12px 25px;
      border: none;
      border-radius: 6px;
      background-color: #007bff;
      color: white;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
    }
    .btn-primary:disabled {
      background-color: #aaa;
      cursor: not-allowed;
    }
    .btn-secondary {
      padding: 12px 25px;
      border: 1px solid #ccc;
      border-radius: 6px;
      background-color: #fff;
      color: #555;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
    }

    /* === CSS MỚI CHO PHIÊN BẢN (VARIANTS) === */
    .variants-section {
        grid-column: 1 / -1; /* Chiếm toàn bộ chiều rộng (2 cột) */
        border-top: 1px solid #eee;
        padding-top: 20px;
    }
    .variants-section h3 {
        font-size: 1.5rem;
        font-weight: 600;
        color: #444;
        margin-bottom: 15px;
    }
    
    /* Danh sách phiên bản đã thêm */
    .variant-list {
        margin-bottom: 20px;
    }
    .variant-item {
        background: #fdfdfd;
        border: 1px solid #eee;
        border-radius: 6px;
        padding: 15px;
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .variant-item-info strong {
        font-size: 1.1rem;
        color: #333;
        background-color: #e0f0ff;
        padding: 5px 10px;
        border-radius: 4px;
        margin-right: 10px;
    }
    .variant-item-info span {
        color: #555;
        font-size: 0.9rem;
    }
    .variant-item-images {
        display: flex;
        gap: 5px;
    }
    .variant-item-images img {
        width: 30px;
        height: 30px;
        border-radius: 4px;
        object-fit: cover;
    }
    .btn-delete-variant {
        background: none;
        border: none;
        color: #dc3545;
        font-size: 1.2rem;
        cursor: pointer;
    }

    /* Form thêm phiên bản mới */
    .variant-form-container {
        background: #fafafa;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 20px;
    }
    .variant-form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 15px;
    }
    .image-input-group {
        grid-column: 1 / -1; /* Chiếm toàn bộ */
        display: flex;
        gap: 10px;
    }
    /* SỬA: Ẩn input[type=file] gốc */
    .image-input-group input[type="file"] {
        display: none;
    }
    /* SỬA: Style cho label (nút) */
    .btn-add-file {
        padding: 10px 15px;
        border: 1px solid #007bff;
        border-radius: 6px;
        background-color: #e0f0ff;
        color: #007bff;
        font-size: 0.9rem;
        font-weight: 600;
        cursor: pointer;
    }
    
    /* Nút "Thêm Phiên bản" */
    .btn-add-variant {
        padding: 12px 20px;
        border: none;
        border-radius: 6px;
        background-color: #28a745;
        color: white;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        grid-column: 1 / -1; /* Chiếm toàn bộ */
        margin-top: 10px;
    }
    
    /* Danh sách ảnh preview của phiên bản */
    .image-preview-list {
        grid-column: 1 / -1;
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 10px;
    }
    .image-preview-item {
        position: relative;
    }
    .image-preview-item img {
        width: 70px;
        height: 70px;
        object-fit: cover;
        border-radius: 6px;
        border: 1px solid #ddd;
    }
    .btn-remove-image {
        position: absolute;
        top: -5px;
        right: -5px;
        background: #dc3545;
        color: white;
        border: none;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 0.8rem;
    }

    /* CSS cho LoadingSpinner (Giống các trang Auth) */
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }
    .loading-spinner {
      border: 5px solid #f3f3f3;
      border-top: 5px solid #007bff;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .show-products_title{
        font-size:24px;
        font-weight: 600;

    }
  `;
  // =======================================================
  // KẾT THÚC CSS
  // =======================================================


  return (
    <>
      <StyleInjector styles={allStyles} />
      <LoadingSpinner isLoading={isLoading} />
      
      <div className="product-admin-container">
        
        {/* Tiêu đề (Giống trang User.jsx) */}
        <div className="show-products"> 
          <div className="show-products_title_container">
            <div className="show-products_title">Thêm Sản Phẩm Mới</div>
          </div>
        </div>

        {/* ============================================ */}
        {/* 1. FORM CHÍNH (Dùng giao diện .form-container) */}
        {/* ============================================ */}
        <form className="form-container" onSubmit={handleSubmit}>
          
          <div className="form-grid">
            
            {/* CỘT 1: Thông tin cơ bản */}
            <div>
              {/* Tên Sản phẩm */}
              <div className="form-item">
                <label htmlFor="productName">Tên Sản Phẩm (*)</label>
                <input
                  type="text"
                  id="productName"
                  name="productName"
                  placeholder="Ví dụ: Tranh Hoàng Hôn"
                  value={productData.productName}
                  onChange={handleChange}
                  className={errors.productName ? 'input-error' : ''}
                />
                {errors.productName && <div className="error-message">{errors.productName}</div>}
              </div>

              {/* Chất liệu */}
              <div className="form-item">
                <label htmlFor="materialId">Chất Liệu (*)</label>
                <select
                  id="materialId"
                  name="materialId"
                  value={productData.materialId}
                  onChange={handleChange}
                  className={errors.materialId ? 'input-error' : ''}
                >
                  <option value="">-- Chọn chất liệu --</option>
                  {Array.isArray(filterData.materials) && filterData.materials.map(mat => (
                    <option key={mat.id} value={mat.id}>{mat.materialName}</option>
                  ))}
                </select>
                {errors.materialId && <div className="error-message">{errors.materialId}</div>}
              </div>

              {/* Thumbnail (Upload File) */}
              <div className="form-item">
                <label htmlFor="thumbnail">Ảnh bìa (Thumbnail)</label>
                <input
                  type="file"
                  id="thumbnail-upload"
                  style={{ display: 'none' }}
                  onChange={handleThumbnailUpload}
                  accept="image/png, image/jpeg, image/webp"
                />
                <label htmlFor="thumbnail-upload" className="btn-secondary" style={{display: 'inline-block', cursor: 'pointer'}}>
                    Chọn ảnh bìa...
                </label>
                
                {thumbnailPreview && (
                    <img 
                      src={thumbnailPreview} 
                      alt="Thumbnail Preview" 
                      style={{
                        width: '100px', 
                        height: '100px', 
                        objectFit: 'cover', 
                        marginTop: '10px', 
                        display: 'block',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                      }} 
                    />
                )}
              </div>
              
              {/* (Đã XÓA ô chọn Trạng thái) */}
              
            </div>
            
            {/* CỘT 2: Phân loại */}
            <div>
              {/* ================================== */}
              {/* SỬA: Danh mục (Phân cấp) */}
              {/* ================================== */}
              <div className="form-item">
                <label>Danh Mục (*)</label>
                <div className={`checkbox-group ${errors.categories ? 'input-error' : ''}`}>
                  {Array.isArray(filterData.categories) && filterData.categories.map(parentCat => {
                    
                    // Logic xoay (Open = true)
                    const isCategoryOpen = openCategories.includes(parentCat.id);
                    
                    return (
                      <div key={parentCat.id} className="category-item-container">
                        {/* Hàng Cha */}
                        <div className="category-parent-row" onClick={() => toggleCategory(parentCat.id)}>
                          <FontAwesomeIcon 
                            icon={faChevronUp} // Luôn là icon "lên"
                            style={{
                              transform: isCategoryOpen ? 'rotate(180deg)' : 'rotate(0deg)', // Xoay 180
                              transition: 'transform 0.3s ease-in-out',
                              display: 'inline-block',
                              marginRight: '10px' // Tăng khoảng cách
                            }}
                          />
                          <input
                            type="checkbox"
                            checked={productData.categoryIds.has(parentCat.id)}
                            onChange={() => handleCategoryChange(parentCat.id)}
                            onClick={(e) => e.stopPropagation()} 
                          />
                          {/* Dùng <span> thay vì <label> để tránh xung đột 'for' */}
                          <span 
                            style={{ marginLeft: '4px', fontWeight: 'bold', cursor: 'pointer' }}
                            onClick={(e) => {
                              e.stopPropagation(); // Ngăn toggle
                              handleCategoryChange(parentCat.id); // Vẫn cho check
                            }}
                          >
                            {parentCat.name}
                          </span>
                        </div>
                        
                        {/* Danh sách Con (Dùng max-height để có hiệu ứng slide) */}
                        <div 
                          className="category-child-list"
                          style={{
                            maxHeight: isCategoryOpen ? '500px' : '0px'
                          }}
                        >
                          {parentCat.children?.map(childCat => (
                            <div key={childCat.id} className="checkbox-item child-item">
                              <label>
                                <input
                                  type="checkbox"
                                  checked={productData.categoryIds.has(childCat.id)}
                                  onChange={() => handleCategoryChange(childCat.id)}
                                />
                                <span>{childCat.name}</span>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {errors.categories && <div className="error-message">{errors.categories}</div>}
              </div>

              {/* ================================== */}
              {/* SỬA: Chủ đề (Topics) - Thêm từng cái */}
              {/* ================================== */}
              <div className="form-item">
                <label htmlFor="topics">Chủ Đề</label>
                <div className="tag-input-group">
                  <input
                    type="text"
                    id="topics"
                    name="topics"
                    placeholder="Nhập chủ đề..."
                    value={currentTopic}
                    onChange={(e) => setCurrentTopic(e.target.value)}
                    onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); handleAddTopic(); } }} // Thêm bằng Enter
                  />
                  <button type="button" className="btn-add-tag" onClick={handleAddTopic}>Thêm</button>
                </div>
                <div className="tag-input-preview">
                    {productData.topics.map((topic, i) => (
                        <div key={i} className="tag-item-wrapper">
                            <span>{topic}</span>
                            <span className="tag-remove-btn" onClick={() => handleRemoveTopic(topic)}>
                                <FontAwesomeIcon icon={faTimes} style={{margin: 0, color: '#777'}}/>
                            </span>
                        </div>
                    ))}
                </div>
              </div>

              {/* ================================== */}
              {/* SỬA: Màu sắc (Colors) - Thêm từng cái */}
              {/* ================================== */}
              <div className="form-item">
                <label htmlFor="colors">Màu Sắc (Mã Hex)</label>
                <div className="tag-input-group color-input-group">
                  <input
                    type="text"
                    id="colors"
                    name="colors"
                    placeholder="Ví dụ: #FF0000"
                    value={currentColor}
                    onChange={handleColorInputChange}
                    className={colorError ? 'input-error' : ''}
                    onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); handleAddColor(); } }} // Thêm bằng Enter
                  />
                  <button type="button" className="btn-add-tag" onClick={handleAddColor}>Thêm</button>
                </div>
                {colorError && <div className="error-message" style={{fontSize: '0.8rem'}}>{colorError}</div>}
                
                <div className="tag-input-preview">
                    {productData.colors.map((hex, i) => (
                        <div key={i} className="color-tag-item">
                            <span className="color-swatch-preview" style={{backgroundColor: hex}}></span>
                            <span>{hex}</span>
                            <span className="tag-remove-btn" onClick={() => handleRemoveColor(hex)}>
                                <FontAwesomeIcon icon={faTimes} style={{margin: 0, color: '#777'}}/>
                            </span>
                        </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Mô tả (Toàn chiều rộng) */}
            <div className="form-item" style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="description">Mô Tả (*)</label>
                <textarea
                  id="description"
                  name="description"
                  rows="5"
                  value={productData.description}
                  onChange={handleChange}
                  className={errors.description ? 'input-error' : ''}
                />
                {errors.description && <div className="error-message">{errors.description}</div>}
            </div>

            {/* ============================================ */}
            {/* PHẦN QUẢN LÝ PHIÊN BẢN (VARIANTS) */}
            {/* ============================================ */}
            <div className="variants-section">
                <h3>Phiên bản Sản phẩm (*)</h3>
                
                {/* 1. Danh sách các phiên bản đã thêm */}
                <div className="variant-list">
                    {variants.length === 0 && (
                        <p style={{color: '#777', fontStyle: 'italic'}}>Chưa có phiên bản nào. Vui lòng thêm ít nhất 1 phiên bản.</p>
                    )}
                    {errors.variants && <div className="error-message">{errors.variants}</div>}
                    
                    {variants.map((variant) => (
                        <div key={variant.tempId} className="variant-item">
                            <div className="variant-item-info">
                                <strong>{variant.dimensions}</strong>
                                <span>(Tồn kho: {variant.stockQuantity} | Giá: {formatCurrency(variant.price)})</span>
                            </div>
                            <div className="variant-item-images">
                                {variant.imagePreviews.map((imgUrl, i) => (
                                    <img key={i} src={imgUrl} alt="variant" />
                                ))}
                            </div>
                            <button 
                                type="button" 
                                className="btn-delete-variant" 
                                onClick={() => handleRemoveVariant(variant.tempId)}
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* 2. Form thêm phiên bản mới */}
                <div className="variant-form-container">
                    <h4>Thêm phiên bản mới</h4>
                    <div className="variant-form-grid">
                        <div className="form-item">
                            <label htmlFor="v_width">Chiều dài (cm)</label>
                            <input type="number" id="v_width" name="width" value={currentVariant.width} onChange={handleVariantChange} placeholder="ví dụ: 30" />
                        </div>
                        <div className="form-item">
                            <label htmlFor="v_height">Chiều rộng (cm)</label>
                            <input type="number" id="v_height" name="height" value={currentVariant.height} onChange={handleVariantChange} placeholder="ví dụ: 40" />
                        </div>
                        <div className="form-item">
                            <label htmlFor="v_stock">Tồn kho</label>
                            {/* SỬA: Khóa (disable) ô Tồn kho */}
                            <input 
                                type="number" 
                                id="v_stock" 
                                name="stockQuantity" 
                                value={currentVariant.stockQuantity} 
                                onChange={handleVariantChange}
                                disabled 
                            />
                        </div>
                        <div className="form-item">
                            <label>Giá (Mặc định 0đ)</label>
                            <input type="text" value="0 ₫" disabled />
                        </div>
                    </div>
                    
                    {/* Thêm ảnh cho phiên bản (Upload File) */}
                    <div className="form-item image-input-group">
                        <input 
                            type="file" 
                            id="variant-image-upload"
                            style={{ display: 'none' }}
                            onChange={handleVariantImageUpload}
                            accept="image/png, image/jpeg, image/webp"
                            multiple // Cho phép chọn nhiều file
                        />
                        <label htmlFor="variant-image-upload" className="btn-add-file" style={{cursor: 'pointer'}}>
                            Thêm ảnh cho phiên bản...
                        </label>
                    </div>
                    
                    {/* Preview ảnh của phiên bản */}
                    <div className="image-preview-list">
                        {currentVariant.imagePreviews.map((imgUrl, i) => (
                            <div key={i} className="image-preview-item">
                                <img src={imgUrl} alt="preview" />
                                <button 
                                    type="button" 
                                    className="btn-remove-image" 
                                    onClick={() => handleVariantImageRemove(i)}
                                >
                                    <FontAwesomeIcon icon={faTimes} style={{margin: 0, color: 'white'}} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <button type="button" className="btn-add-variant" onClick={handleAddVariant}>
                        <FontAwesomeIcon icon={faPlus} /> Thêm phiên bản
                    </button>
                </div>
            </div>
            
          </div>
          
          {/* Nút Submit chính */}
          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'Đang xử lý...' : 'Lưu Sản phẩm'}
            </button>
            <button type="button" className="btn-secondary" onClick={() => navigate('/admin/products')}>
              Hủy
            </button>
          </div>

        </form>
      </div>
    </>
  );
}
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const API_BASE_URL = "https://deployforstudy-1.onrender.com";

// --- HELPER: StyleInjector & Icons ---
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

// Icons
const faChevronUp = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor"><path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"/></svg>;
const faChevronDown = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>;
const faPlus = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="1em" height="1em" fill="currentColor"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>;
const faTrash = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="1em" height="1em" fill="currentColor"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>;
const faTimes = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="1em" height="1em" fill="currentColor"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>;
const faLock = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="1em" height="1em" fill="currentColor"><path d="M144 144v-32c0-53 43-96 96-96s96 43 96 96v32C352 166.7 365.3 180 384 180s32-13.3 32-32V112C416 50.1 365.9 0 304 0S192 50.1 192 112v32c0 17.7 14.3 32 32 32s32-14.3 32-32zM320 192H128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V256c0-35.3-28.7-64-64-64zM224 384c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z"/></svg>;
const faCamera = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor"><path d="M149.1 64.8L138.7 96H64C28.7 96 0 124.7 0 160V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H373.3L362.9 64.8C356.4 45.2 338.1 32 317.4 32H194.6c-20.7 0-39 13.2-45.5 32.8zM256 192a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"/></svg>;

const FontAwesomeIcon = ({ icon, style, onClick, className }) => (
  <span style={{ ...style, display: 'inline-block', width: '1em', height: '1em', verticalAlign: 'middle', marginRight: '8px' }} onClick={onClick} className={className}>
    {icon}
  </span>
);

const getAuthToken = () => localStorage.getItem('accessToken');
const createAuthHeaders = () => {
    const token = getAuthToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};
const formatCurrency = (value) => {
    if (!value) return "0 ₫";
    return value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
};

export default function ProductAdmin_Edit() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [filterData, setFilterData] = useState({ categories: [], materials: [] });
  const [openCategories, setOpenCategories] = useState([]);

  const [productData, setProductData] = useState({
    productName: '', description: '', thumbnail: '', materialId: '', productStatus: 1,
    categoryIds: new Set(), topics: [], colors: [],
  });
  
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [variants, setVariants] = useState([]);

  // State form thêm variant mới
  const [currentVariant, setCurrentVariant] = useState({
    width: '', height: '', 
    stockQuantity: '0', 
    price: '0', 
    costPrice: '0', 
    images: [], 
  });

  // MỚI: State để biết đang upload ảnh cho Variant nào trong danh sách cũ
  const [uploadingVariantIndex, setUploadingVariantIndex] = useState(null);
  
  const [currentTopic, setCurrentTopic] = useState('');
  const [currentColor, setCurrentColor] = useState('#');
  const [colorError, setColorError] = useState('');
  const hexRegex = /^#(?:[0-9a-fA-F]{3}){1,2}$/;

  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // --- 1. Load Data ---
  useEffect(() => {
    const fetchFilterData = async () => {
        try {
            const headers = createAuthHeaders();
            const catResponse = await axios.get(`${API_BASE_URL}/api/v1/categories/all`, { headers });
            const matResponse = await axios.get(`${API_BASE_URL}/api/v1/materials/all`, { headers });
            
            const categoriesData = Array.isArray(catResponse.data) ? catResponse.data : (catResponse.data?.content || []);
            const materialsData = Array.isArray(matResponse.data) ? matResponse.data : (matResponse.data?.content || []);

            setFilterData({ categories: categoriesData, materials: materialsData });
            setOpenCategories([]); 
        } catch (error) {
            console.error("Lỗi tải dữ liệu:", error);
        }
    };
    fetchFilterData();
  }, []);

  useEffect(() => {
      const fetchProductDetail = async () => {
          setIsLoading(true);
          try {
              const headers = createAuthHeaders();
              const response = await axios.get(`${API_BASE_URL}/api/v1/admin/products/${id}`, { headers });
              const p = response.data;

              setProductData({
                  productName: p.productName,
                  description: p.description,
                  thumbnail: p.thumbnail,
                  materialId: p.material?.id || '',
                  productStatus: p.productStatus !== undefined ? p.productStatus : 1,
                  categoryIds: new Set(p.categories?.map(c => c.id) || []),
                  topics: p.topics?.map(t => t.topicName) || [],
                  colors: p.colors?.map(c => c.hexCode) || [],
              });
              setThumbnailPreview(p.thumbnail);

              if (p.variants) {
                setVariants(p.variants.map(v => ({
                    id: v.id, 
                    dimensions: v.dimensions,
                    price: v.price || 0,
                    stockQuantity: v.stockQuantity || 0,
                    costPrice: v.costPrice || 0,
                    images: v.images?.map(img => img.imageUrl) || []
                })));
              }
          } catch (error) {
              toast.error("Không thể tải sản phẩm.");
              navigate('/admin/product');
          } finally {
              setIsLoading(false);
          }
      };
      if (id) fetchProductDetail();
  }, [id, navigate]);

  // --- API UPLOAD ---
  const uploadFileToCloudinary = async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post(`${API_BASE_URL}/api/v1/files/upload`, formData, {
          headers: { ...createAuthHeaders(), 'Content-Type': 'multipart/form-data' }
      });
      return response.data.url; 
  };

  // --- HANDLERS INPUT ---
  const handleChange = (e) => setProductData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    try {
        const url = await uploadFileToCloudinary(file);
        setProductData(prev => ({ ...prev, thumbnail: url }));
        setThumbnailPreview(url);
        toast.success("Upload ảnh bìa thành công");
    } catch (e) { toast.error("Lỗi upload ảnh."); } 
    finally { setIsUploading(false); e.target.value = null; }
  };

  // Logic Danh Mục & Tag (Giữ nguyên)
  const toggleCategory = (id) => setOpenCategories(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  const handleCategoryChange = (id) => setProductData(prev => {
      const newSet = new Set(prev.categoryIds);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return { ...prev, categoryIds: newSet };
  });
  const handleAddTopic = () => {
    if (!currentTopic.trim() || productData.topics.includes(currentTopic.trim())) return;
    setProductData(prev => ({ ...prev, topics: [...prev.topics, currentTopic.trim()] }));
    setCurrentTopic('');
  };
  const handleRemoveTopic = (t) => setProductData(prev => ({ ...prev, topics: prev.topics.filter(i => i !== t) }));
  const handleAddColor = () => {
    if (!currentColor.trim() || !hexRegex.test(currentColor)) { setColorError("Mã màu sai."); return; }
    if (!productData.colors.includes(currentColor)) setProductData(prev => ({ ...prev, colors: [...prev.colors, currentColor] }));
    setCurrentColor('#'); setColorError('');
  };
  const handleRemoveColor = (c) => setProductData(prev => ({ ...prev, colors: prev.colors.filter(i => i !== c) }));

  // --- LOGIC VARIANTS CŨ (Đã có trong List) ---
  const handleExistingVariantChange = (index, field, value) => {
      const newVariants = [...variants];
      newVariants[index][field] = value.replace(/[^0-9]/g, '');
      setVariants(newVariants);
  };

  // MỚI: Hàm thêm ảnh cho Variant cũ
  const handleAddImageToExistingVariant = async (index, e) => {
      const files = Array.from(e.target.files);
      if (!files.length) return;
      setIsUploading(true);
      try {
          const urls = await Promise.all(files.map(f => uploadFileToCloudinary(f)));
          const newVariants = [...variants];
          // Nối ảnh mới vào danh sách ảnh cũ
          newVariants[index].images = [...newVariants[index].images, ...urls];
          setVariants(newVariants);
          toast.success(`Đã thêm ${urls.length} ảnh.`);
      } catch { toast.error("Lỗi upload ảnh variant."); }
      finally { setIsUploading(false); e.target.value = null; }
  };

  // MỚI: Hàm xóa ảnh khỏi Variant cũ
  const handleRemoveImageFromExistingVariant = (variantIndex, imgIndex) => {
      const newVariants = [...variants];
      newVariants[variantIndex].images = newVariants[variantIndex].images.filter((_, i) => i !== imgIndex);
      setVariants(newVariants);
  };

  // --- LOGIC VARIANTS MỚI (Trong Form) ---
  const handleNewVariantChange = (e) => {
      const { name, value } = e.target;
      const val = value.replace(/[^0-9]/g, '');
      setCurrentVariant(prev => ({ ...prev, [name]: val }));
  };
  const handleVariantImageUpload = async (e) => {
      const files = Array.from(e.target.files);
      if (!files.length) return;
      setIsUploading(true);
      try {
          const urls = await Promise.all(files.map(f => uploadFileToCloudinary(f)));
          setCurrentVariant(prev => ({ ...prev, images: [...prev.images, ...urls] }));
          toast.success("Upload ảnh phiên bản thành công");
      } catch { toast.error("Lỗi upload ảnh"); }
      finally { setIsUploading(false); e.target.value = null; }
  };
  const handleRemoveNewVariantImage = (idx) => {
      setCurrentVariant(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };
  const handleAddVariant = () => {
      const { width, height, images } = currentVariant;
      if (!width || !height) { toast.error("Nhập kích thước."); return; }
      if (images.length === 0) { toast.error("Cần ít nhất 1 ảnh."); return; }
      const newV = {
          tempId: Date.now(), id: null, dimensions: `${width}x${height}cm`,
          price: 0, stockQuantity: 0, costPrice: 0, images: images
      };
      setVariants(prev => [...prev, newV]);
      setCurrentVariant({ width: '', height: '', stockQuantity: '0', price: '0', costPrice: '0', images: [] });
  };
  const handleRemoveVariant = (v) => {
      if (v.id) { toast.warning("Không thể xóa phiên bản cũ."); return; }
      setVariants(prev => prev.filter(item => item.tempId !== v.tempId));
  };

  // --- SUBMIT ---
  const handleSubmit = async (e) => {
      e.preventDefault();
      if (!productData.productName) { toast.error("Nhập tên sản phẩm."); return; }
      if(productData.categoryIds.size==0){toast.error("Chưa có danh mục!");return;}
            setIsLoading(true);

      try {
          const payload = {
              productName: productData.productName,
              description: productData.description,
              thumbnail: productData.thumbnail,
              materialId: productData.materialId,
              productStatus: productData.productStatus,
              categories: Array.from(productData.categoryIds).map(id => ({ id })),
              topics: productData.topics.map(t => ({ topicName: t })),
              colors: productData.colors.map(c => ({ hexCode: c })),
              variants: variants.map(v => ({
                  id: v.id || null, 
                  dimensions: v.dimensions,
                  price: v.price,
                  stockQuantity: v.stockQuantity,
                  costPrice: v.costPrice,
                  images: v.images.map(url => ({ imageUrl: url })) // Gửi list URL
              }))
          };
          await axios.put(`${API_BASE_URL}/api/v1/admin/products/${id}`, payload, {
              headers: { ...createAuthHeaders(), 'Content-Type': 'application/json' }
          });
          toast.success("Cập nhật thành công!");
          navigate('/admin/product');
      } catch (error) {
          toast.error("Cập nhật thất bại: " + (error.response?.data?.message || error.message));
      } finally { setIsLoading(false); }
  };

  const allStyles = `
    /* ... (CSS giữ nguyên từ trang Add) ... */
    .product-edit-container { padding: 20px; background: #f4f7fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .form-container { background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
    .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 20px; }
    @media (max-width: 768px) { .form-grid-2 { grid-template-columns: 1fr; } }
    
    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; font-weight: 600; margin-bottom: 8px; color: #333; font-size: 0.9rem; text-transform: uppercase; }
    .form-input, .form-select, .form-textarea { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; box-sizing: border-box; }
    .form-input:disabled { background: #f0f0f0; color: #666; cursor: not-allowed; }
    .form-input:focus { border-color: #007bff; outline: none; }
    
    .category-box {     max-height: 250px;
    overflow-y: auto;
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 0;}
    .cat-parent {     display: flex;
    align-items: center;
    padding: 10px;
    cursor: pointer;
    background-color: #f9f9f9;}
    .cat-parent:hover { background: #e9ecef; }
    .cat-children { background: white; padding: 0; }
    .cat-child-item { padding: 8px 15px 8px 45px; display: flex; align-items: center; border-bottom: 1px solid #f5f5f5; }
    .cat-child-item:hover { background: #fcfcfc; }
    .cat-checkbox { margin-right: 10px; width: 16px; height: 16px; cursor: pointer; }
    .cat-name { font-size: 14px; cursor: pointer; font-weight: normal; text-transform: none; }

    .tag-container { display: flex; gap: 10px; margin-bottom: 10px; }
    .tag-input-group { display: flex; gap: 10px; width: 100%; }
    .tag-input-group input { flex-grow: 1; }
    .btn-add-tag { padding: 10px 15px; border: 1px solid #007bff; border-radius: 6px; background: #e0f0ff; color: #007bff; font-weight: 600; cursor: pointer; white-space: nowrap; }
    .tag-input-preview { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
    .tag-item-wrapper { background: #f0f0f0; border: 1px solid #ddd; border-radius: 4px; padding: 3px 8px; font-size: 0.9rem; display: flex; align-items: center; gap: 5px;}
    .color-tag-item { display: flex; align-items: center; background: #f0f0f0; border: 1px solid #ddd; border-radius: 15px; padding: 3px 8px; font-size: 0.9rem; gap: 5px;}
    .color-swatch-preview { width: 16px; height: 16px; border-radius: 50%; border: 1px solid #ccc; }
    .tag-remove-btn { cursor: pointer; color: #777; } .tag-remove-btn:hover { color: #dc3545; }

    .variants-section { grid-column: 1 / -1; border-top: 1px solid #eee; padding-top: 20px; }
    .variant-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px; }
    .variant-table th { background: #f1f3f5; padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6; }
    .variant-table td { padding: 12px; border-bottom: 1px solid #eee; vertical-align: middle; }
    .variant-table input { width: 100px; padding: 6px; border: 1px solid #ddd; border-radius: 4px; }
    
    .variant-imgs { display: flex; gap: 5px; flex-wrap: wrap; align-items: center; }
    .variant-imgs img { width: 40px; height: 40px; object-fit: cover; border-radius: 4px; border: 1px solid #eee; }
    .btn-mini-add-img { background: #e0f0ff; color: #007bff; border: 1px solid #007bff; border-radius: 50%; width: 24px; height: 24px; display: flex; justify-content: center; align-items: center; cursor: pointer; font-size: 12px; }
    .btn-mini-remove-img { position: absolute; top: -5px; right: -5px; background: red; color: white; border-radius: 50%; width: 14px; height: 14px; font-size: 10px; display: flex; justify-content: center; align-items: center; cursor: pointer; border:none; }
    
    .btn-delete-variant { background: none; border: none; color: #dc3545; font-size: 1.2rem; cursor: pointer; }
    .btn-delete-variant:disabled { color: #ccc; cursor: not-allowed; }

    .new-variant-box { background: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px dashed #ccc; }
    .new-variant-grid { display: flex; gap: 15px; margin-bottom: 15px; flex-wrap: wrap;}
    .new-variant-item { flex: 1; min-width: 100px; }
    .btn-add-file { padding: 10px 15px; border: 1px solid #007bff; border-radius: 6px; background: #e0f0ff; color: #007bff; cursor: pointer; font-weight: 600; font-size: 0.9rem; }
    .image-preview-list { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px; }
    .image-preview-item { position: relative; }
    .image-preview-item img { width: 60px; height: 60px; object-fit: cover; border-radius: 6px; border: 1px solid #ddd; }
    .btn-remove-image { position: absolute; top: -5px; right: -5px; background: #dc3545; color: white; border: none; border-radius: 50%; width: 18px; height: 18px; display: flex; justify-content: center; align-items: center; cursor: pointer; font-size: 10px; }
    .btn-add-variant { padding: 12px 20px; border: none; border-radius: 6px; background: #28a745; color: white; font-weight: 600; cursor: pointer; grid-column: 1 / -1; margin-top: 10px; }

    .form-actions { display: flex; gap: 10px; margin-top: 20px; border-top: 1px solid #eee; padding-top: 20px; }
    .btn-save { background: #007bff; color: white; padding: 12px 30px; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; }
    .btn-cancel { background: white; border: 1px solid #ccc; color: #333; padding: 12px 30px; border-radius: 6px; background: #fff; font-weight: 600; cursor: pointer; }
    .btn-save:disabled { background: #aaa; cursor: not-allowed; }

    .loading-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255, 255, 255, 0.7); display: flex; justify-content: center; align-items: center; z-index: 9999; }
    .loading-spinner { border: 5px solid #f3f3f3; border-top: 5px solid #007bff; border-radius: 50%; width: 50px; height: 50px; animation: spin 1s linear infinite; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    .show-products_title { font-size: 24px; font-weight: 600; margin-bottom: 20px; border-bottom: 1px solid #ddd; padding-bottom: 15px; }
    .error-message { color: #dc3545; font-size: 0.85rem; margin-top: 5px; }
    .input-error { border-color: #dc3545; }

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
  `;

  return (
    <>
      <StyleInjector styles={allStyles} />
      <LoadingSpinner isLoading={isLoading || isUploading} />
      <div className="product-admin-container">
        <div className="show-products"> 
          <div className="show-products_title_container">
            <div className="show-products_title">Cập nhật Sản Phẩm #{id}</div>
          </div>
        </div>

        <form className="form-container" onSubmit={handleSubmit}>
          <div className="form-grid-2">
            {/* CỘT TRÁI */}
            <div>
              <div className="form-group"><label>Tên Sản Phẩm (*)</label><input className="form-input" name="productName" value={productData.productName} onChange={handleChange} /></div>
              <div className="form-group">
                <label>Chất Liệu (*)</label>
                <select className="form-select" name="materialId" value={productData.materialId} onChange={handleChange}>
                  <option value="">-- Chọn chất liệu --</option>
                  {Array.isArray(filterData.materials) && filterData.materials.map(m => (<option key={m.id} value={m.id}>{m.materialName}</option>))}
                </select>
              </div>
              <div className="form-group">
                  <label>Trạng Thái (*)</label>
                  <select className="form-select" name="productStatus" value={productData.productStatus} onChange={handleChange}>
                      <option value="1">Hoạt động (Hiện)</option>
                      <option value="0">Tạm khóa (Ẩn)</option>
                  </select>
              </div>
              <div className="form-group">
                <label>Ảnh Bìa</label>
                <input type="file" id="thumb-up" style={{display:'none'}} onChange={handleThumbnailUpload} />
                <label htmlFor="thumb-up" className="btn-secondary" style={{display:'inline-block', cursor:'pointer', marginBottom:10}}>Chọn ảnh mới</label>
                {thumbnailPreview && <img src={thumbnailPreview} alt="Preview" style={{width:100, height:100, objectFit:'cover', display:'block', border:'1px solid #ddd', borderRadius:4}} />}
              </div>
            </div>

            {/* CỘT PHẢI */}
            <div>
                <div className="form-item">
                <label>Danh Mục (*)</label>
                <div className={`checkbox-group`}>
                  {Array.isArray(filterData.categories) && filterData.categories.map(parentCat => {
                    console.log(parentCat)
                    // Logic xoay (Open = true)
                    const isCategoryOpen = openCategories.includes(parentCat.id);
                    
                    return (
                        parentCat.children.length!==0?(
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
                    ):'');
                  })}
                </div>
              </div>

              {/* DANH MỤC */}
              
           

              {/* TAGS */}
              <div className="form-group">
                <label>Chủ đề</label>
                <div className="tag-container">
                  <input className="form-input" value={currentTopic} onChange={e => setCurrentTopic(e.target.value)} placeholder="Nhập chủ đề..." onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddTopic())}/>
                  <button type="button" className="btn-add-tag" onClick={handleAddTopic}>Thêm</button>
                </div>
                <div className="tag-input-preview">
                  {productData.topics.map((t, i) => (
                      <div key={i} className="tag-item-wrapper">{t} <span className="tag-remove-btn" onClick={() => handleRemoveTopic(t)}>{faTimes}</span></div>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Màu sắc (Hex)</label>
                <div className="tag-container">
                  <input className="form-input" value={currentColor} onChange={e => {setCurrentColor(e.target.value); setColorError('')}} placeholder="#FF0000" onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddColor())}/>
                  <button type="button" className="btn-add-tag" onClick={handleAddColor}>Thêm</button>
                </div>
                {colorError && <small style={{color:'red'}}>{colorError}</small>}
                <div className="tag-input-preview">
                  {productData.colors.map((c, i) => (
                      <div key={i} className="color-tag-item">
                          <span className="color-swatch-preview" style={{background: c}}></span>{c} <span className="tag-remove-btn" onClick={() => handleRemoveColor(c)}>{faTimes}</span>
                      </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="form-group"><label>Mô tả (*)</label><textarea className="form-textarea" rows="4" name="description" value={productData.description} onChange={handleChange}></textarea></div>

          {/* QUẢN LÝ PHIÊN BẢN */}
          <div className="form-group" style={{marginTop: 40, paddingTop: 20, borderTop: '2px dashed #eee'}}>
            <h3>Quản lý Phiên bản</h3>
            <table className="variant-table">
              <thead><tr><th>Kích thước</th><th>Giá Bán</th><th>Giá Nhập</th><th>Tồn kho</th><th>Hình ảnh</th><th>Xóa</th></tr></thead>
              <tbody>
                {variants.map((v, idx) => (
                  <tr key={idx}>
                    <td>{v.dimensions}</td>
<td>
  <input
    className="form-input"
    type="text"
    value={v.price}
    disabled={v.price === 0}
    onChange={(e) =>
      handleExistingVariantChange(idx, "price", e.target.value)
    }
  />
</td>                    <td><input className="form-input" type="text" value={v.costPrice} disabled style={{background: '#f9f9f9', border: 'none'}} /></td>
                    <td>{v.stockQuantity}</td>
                    <td>
                      <div className="variant-imgs">
                        {v.images.map((url, i) => (
                            <div key={i} style={{position:'relative'}}>
                                <img src={url} alt="v" />
                                {/* SỬA: Nút xóa ảnh cho variant cũ */}
                                <button type="button" className="btn-mini-remove-img" onClick={() => handleRemoveImageFromExistingVariant(idx, i)}>{faTimes}</button>
                            </div>
                        ))}
                        {/* SỬA: Nút thêm ảnh cho variant cũ */}
                        <label style={{textAlign:'center',color:'blue',paddingTop:'2px'}} className="btn-mini-add-img">
                            {faPlus}
                            <input type="file" multiple style={{display:'none'}} onChange={(e) => handleAddImageToExistingVariant(idx, e)} />
                        </label>
                      </div>
                    </td>
                    <td>
                      <button type="button" className="btn-icon text-danger" disabled={!!v.id} onClick={() => { if(!v.id) handleRemoveVariant(v); }} title={v.id ? "Không được xóa phiên bản cũ" : "Xóa"}>
                        {v.id ? faLock : faTrash}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="new-variant-box">
              <h4>+ Thêm Phiên bản Mới</h4>
              <div className="new-variant-grid">
                <div className="new-variant-item"><label>Dài</label><input className="form-input" name="width" value={currentVariant.width} onChange={handleNewVariantChange} /></div>
                <div className="new-variant-item"><label>Rộng</label><input className="form-input" name="height" value={currentVariant.height} onChange={handleNewVariantChange} /></div>
                {/* SỬA: Khóa giá nhập và giá bán cho variant mới */}
                <div className="new-variant-item"><label>Giá bán</label><input className="form-input" value="0" disabled /></div>
                <div className="new-variant-item"><label>Giá nhập</label><input className="form-input" value="0" disabled /></div>
              </div>
              <div style={{display:'flex', gap:10, alignItems:'center'}}>
                  <input type="file" multiple onChange={handleVariantImageUpload} id="v-up" style={{display:'none'}} />
                  <label htmlFor="v-up" className="btn-add-file">Chọn ảnh...</label>
                  <div className="image-preview-list">
                      {currentVariant.images.map((url, i) => (
                          <div key={i} className="image-preview-item">
                              <img src={url} alt="pre" />
                              <span className="btn-remove-image" onClick={() => handleRemoveNewVariantImage(i)}>{faTimes}</span>
                          </div>
                      ))}
                  </div>
              </div>
              <button type="button" className="btn-add-variant" onClick={handleAddVariant}>{faPlus} Thêm vào danh sách</button>
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-save" disabled={isLoading || isUploading}>{isLoading ? 'Đang lưu...' : 'LƯU THAY ĐỔI'}</button>
            <button type="button" className="btn-cancel" onClick={() => navigate('/admin/product')}>Hủy bỏ</button>
          </div>
        </form>
      </div>
    </>
  );
}
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
// import tt from '@tomtom-international/web-sdk-maps';
// import '@tomtom-international/web-sdk-maps/dist/maps.css';
import Header from '../../components/Header'
// URL backend 
const API_BASE_URL = 'http://localhost:8888';
// Lấy API key từ file .env
const TOMTOM_API_KEY = process.env.REACT_APP_TOMTOM_API_KEY;

// --- CÁC COMPONENT TỰ CHỨA ĐỂ KHẮC PHỤC LỖI IMPORT ---
// (Copy từ các file Auth của bạn để đảm bảo nhất quán)

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
const faUser = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="1em" height="1em" fill="currentColor" style={{ paddingBottom: '5px' }}><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/></svg>
);
const faLocationDot = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 384 512"
    width="1em"
    height="1em"
    fill="currentColor"
    style={{ paddingBottom: '5px' }}
  >
    <path d="M168 0C75.1 0 0 75.1 0 168c0 87.6 135.3 303.4 160 336.7 6 8 17.9 8 23.9 0C248.7 471.4 384 255.6 384 168 384 75.1 308.9 0 216 0H168zm24 240c-39.8 0-72-32.2-72-72s32.2-72 72-72 72 32.2 72 72-32.2 72-72 72z"/>
  </svg>
);
const faMapMarkerAlt = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="1.5em" height="1.5em" fill="currentColor" style={{ paddingBottom: '5px' }} ><path d="M172.3 501.7C27 399.4 0 364.5 0 288 0 128.9 128.9 0 288 0c19.4 0 37.9 1.9 55.4 5.4 17.1 3.4 33.6 8.5 49.3 15.1 16.2 6.8 31.4 15.3 45.4 25.4 13.4 9.8 25.5 21.2 36.1 33.8 10.9 12.9 20.3 27.2 28.1 42.7 8.3 16.3 15.1 33.7 20.2 51.8 4.7 16.8 8.1 34.3 10.2 52.3 2.5 21.2 3.8 42.9 3.8 64.9 0 76.5-27 111.4-172.3 213.7C203.4 518.1 180.6 518.1 172.3 501.7zM288 128c-35.3 0-64 28.7-64 64s28.7 64 64 64 64-28.7 64-64-28.7-64-64-64z"/></svg>
);
const faTrash = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="1em" height="1em" fill="currentColor"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
);
const faStar = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="1em" height="1em" fill="currentColor" style={{ paddingBottom: '3px' }}><path d="M316.9 18C311.6 7 300.4 0 288 0s-23.6 7-28.9 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.2 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381 150.3 316.9 18z"/></svg>
);
const faMapPin = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="0.5em" height="0.5em" fill="currentColor"><path d="M168.3 499.2C178.1 511.9 194.1 511.9 203.9 499.2l171.3-171.3c9.3-9.4 24.5-9.5 33.9-.2s9.5 24.5.2 33.9L242.7 528.3c-11.8 11.6-30.8 11.6-42.7 0L33.2 361.7c-9.3-9.4-9.2-24.5.2-33.9s24.5-9.2 33.9 .2L168.3 499.2zM192 0C119 0 64 55 64 128s55 128 128 128 128-55 128-128S265 0 192 0zm0 224c-53 0-96-43-96-96s43-96 96-96 96 43 96 96-43 96-96 96z"/></svg>
);
const faLocationCrosshairs = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    width="1em"
    height="1.2em"
    fill="currentColor"
    style={{ paddingBottom: '2px' }}
  >
    <path d="M256 0C242.7 0 232 10.7 232 24V80.1C123.2 84.3 43.7 163.8 39.5 272H96c13.3 0 24 10.7 24 24s-10.7 24-24 24H39.5C43.7 348.2 123.2 427.7 232 431.9V488c0 13.3 10.7 24 24 24s24-10.7 24-24V431.9c108.8-4.2 188.3-83.7 192.5-192H416c-13.3 0-24-10.7-24-24s10.7-24 24-24h56.5C468.3 163.8 388.8 84.3 280 80.1V24c0-13.3-10.7-24-24-24zm0 128c70.7 0 128 57.3 128 128s-57.3 128-128 128-128-57.3-128-128 57.3-128 128-128z"/>
  </svg>
);

const faThumbtack = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 384 512"
    width="1em"
    height="1em"
    fill="currentColor"
  >
    <path d="M32 32C32 14.3 46.3 0 64 0H320c17.7 0 32 14.3 32 32v112c0 35.3-28.7 64-64 64v64l42.7 85.3c4.2 8.5 5.3 18.3 3 27.6L319.1 512H64.9L38.3 385.9c-2.3-9.3-1.2-19.1 3-27.6L84 272V208c-35.3 0-64-28.7-64-64V32z"/>
  </svg>
);


const FontAwesomeIcon = ({ icon, style }) => {
  return (
    <span style={{ ...style, display: 'inline-block', width: '1em', height: '1em', verticalAlign: 'middle', marginRight: '8px' }}>
      {icon}
    </span>
  );
};

// MỚI: Icon Cảnh báo (cho modal xóa)
const faWarning = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor"><path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40C25.7 480 13.7 467.1 13.4 452s7-27.7 14.3-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/></svg>
);

// =======================================================
// MỚI: Component Modal Xác Nhận (thay thế window.confirm)
// =======================================================
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    // Lớp phủ (overlay)
    <div className="confirm-modal-overlay" onClick={onClose}>
      <div 
        className="confirm-modal-box" 
        onClick={(e) => e.stopPropagation()} // Ngăn click bên trong modal đóng modal
      >
        <div className="confirm-modal-header">
          <FontAwesomeIcon icon={faWarning} style={{ color: '#dc3545' }} />
          <h3>{title}</h3>
        </div>
        <div className="confirm-modal-body">
          <p>{message}</p>
        </div>
        <div className="confirm-modal-actions">
          <button 
            type="button" 
            className="btn-secondary" 
            onClick={onClose}
          >
            Hủy
          </button>
          <button 
            type="button" 
            className="btn-primary" // Nút Xóa (màu đỏ)
            onClick={onConfirm}
          >
            Xác nhận Xóa
          </button>
        </div>
      </div>
    </div>
  );
};
// --- KẾT THÚC COMPONENT TỰ CHỨA ---

// --- KẾT THÚC COMPONENT TỰ CHỨA ---


// Hàm helper lấy token (Giả sử bạn lưu token trong localStorage khi đăng nhập)
const getAuthToken = () => {
    return localStorage.getItem('user');
};

// Hàm helper để tạo header cho axios
const createAuthHeaders = () => {
    const token = getAuthToken();
    if (token) {
        return { 'Authorization': `Bearer ${token}` };
    }
    return {};
};


export default function UserProfilePage() {
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' hoặc 'addresses'
  
  // State cho Tab Hồ sơ
  const [userData, setUserData] = useState({}); // Dữ liệu gốc
  const [profileFormData, setProfileFormData] = useState({ fullName: '', phoneNumber: '' });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  // State cho Tab Địa chỉ
  const [addresses, setAddresses] = useState([]);
  const [addressFormData, setAddressFormData] = useState({ addressName: '', address: '' });
  const [addressError, setAddressError] = useState('');

  // State cho TomTom Map
  const [isSdkLoaded, setIsSdkLoaded] = useState(!!(window.tt && window.tt.services)); // Kiểm tra cả 'services'
  const [searchResults, setSearchResults] = useState([]); // Gợi ý fuzzy search
  const [selectedLatLon, setSelectedLatLon] = useState({ lat: null, lon: null }); // Vĩ độ, Kinh độ

  // Refs cho Map
  const mapContainerRef = useRef(null); // Ref cho thẻ div chứa map
  const mapInstanceRef = useRef(null); // Ref cho đối tượng map (tt.map)
  const markerRef = useRef(null); // Ref cho ghim (marker)
  const debounceTimerRef = useRef(null); // Ref cho debounce search

  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null); // Lưu địa chỉ (hoặc ID) sắp xóa
  // Tải TomTom SDK (JS và CSS)
  useEffect(() => {
    if (isSdkLoaded) return; // Chỉ tải 1 lần

    const loadSDK = () => {
      // 1. Tải CSS
      const cssLink = document.createElement('link');
      cssLink.rel = 'stylesheet';
      cssLink.href = 'https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.25.0/maps/maps.css';
      cssLink.id = 'tomtom-maps-css';
      document.head.appendChild(cssLink);

      // 2. Tải JS (Bao gồm cả Maps)
      const mapScript = document.createElement('script');
      mapScript.src = 'https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.25.0/maps/maps-web.min.js';
      mapScript.async = true;
      mapScript.id = 'tomtom-maps-js';
      
      mapScript.onload = () => {
          // KHI MAPS TẢI XONG, TẢI SERVICES
          const servicesScript = document.createElement('script');
          servicesScript.src = 'https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.25.0/services/services-web.min.js';
          servicesScript.async = true;
          servicesScript.id = 'tomtom-services-js';
          servicesScript.onload = () => {
              setIsSdkLoaded(true); // Chỉ set loaded KHI CẢ HAI đã tải xong
          };
          servicesScript.onerror = () => toast.error("Không thể tải SDK dịch vụ bản đồ.");
          document.body.appendChild(servicesScript);
      };
      mapScript.onerror = () => {
          toast.error("Không thể tải SDK bản đồ. Vui lòng kiểm tra kết nối.");
      }
      document.body.appendChild(mapScript);
    };

    // Đảm bảo window.tt không tồn tại trước khi tải
    if (!window.tt) {
      loadSDK();
    } else {
      setIsSdkLoaded(true);
    }

    // Cleanup: Xóa script và css khi component unmount
    return () => {
        const scriptMap = document.getElementById('tomtom-maps-js');
        const scriptServices = document.getElementById('tomtom-services-js');
        const cssEl = document.getElementById('tomtom-maps-css');
        
        if (scriptMap) document.body.removeChild(scriptMap);
        if (scriptServices) document.body.removeChild(scriptServices);
        if (cssEl) document.head.removeChild(cssEl);
    };
  }, [isSdkLoaded]);


  // Load dữ liệu người dùng và địa chỉ khi trang được tải
  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    const headers = createAuthHeaders();
    if (Object.keys(headers).length === 0) {
        toast.error("Vui lòng đăng nhập.");
        navigate('/login');
        return;
    }
    try {
        const [userResponse, addressResponse] = await Promise.all([
            axios.get(`${API_BASE_URL}/api/v1/users/me`, { headers }),
            axios.get(`${API_BASE_URL}/api/v1/users/me/addresses`, { headers })
        ]);
        const user = userResponse.data;
        setUserData(user);
        setProfileFormData({ fullName: user.fullName || '', phoneNumber: user.phoneNumber || '' });
        setAddresses(addressResponse.data || []);
    } catch (error) {
        console.error("Lỗi tải dữ liệu cá nhân:", error);
        toast.error(error.response?.data || "Lỗi tải dữ liệu.");
        if (error.response?.status === 401 || error.response?.status === 403) {
            localStorage.removeItem('accessToken');
            navigate('/login', { state: { message: "Phiên đăng nhập đã hết hạn." } });
        }
    } finally {
        setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // =======================================================
  // SỬA: Khởi tạo bản đồ (Thêm Geolocation và Custom Marker)
  // =======================================================
  useEffect(() => {
    // Chỉ khởi tạo khi: SDK đã sẵn sàng, API key có, 
    // tab 'addresses' đang mở, và map CHƯA được tạo
    if (  !TOMTOM_API_KEY || activeTab !== 'addresses' ) {
      return;
    }
    
    // --- HÀM KHỞI TẠO MAP ---
    const initializeMap = (centerCoords) => {
      const map = window.tt.map({
        key: TOMTOM_API_KEY,
        container: mapContainerRef.current,
        center: centerCoords, 
        zoom: 15
      });

      // Tạo Custom Marker (Ghim tùy chỉnh)
      const markerEl = document.createElement('div');
      markerEl.className = 'custom-marker'; // Gán class (đã định nghĩa trong allStyles)
      
      const marker = new window.tt.Marker({ 
          element: markerEl, 
          anchor: 'bottom', 
          draggable: true 
      }) 
        .setLngLat(centerCoords) 
        .addTo(map);

      // Hàm helper để xử lý Reverse Geocode (Tìm địa chỉ từ tọa độ)
      const updateAddressFromMap = (lngLat) => {
        setSelectedLatLon({ lat: lngLat.lat, lon: lngLat.lng });
        if (!window.tt.services) {
            console.error("TomTom Services SDK chưa tải xong!");
            return;
        }

        window.tt.services.reverseGeocode({
          key: TOMTOM_API_KEY,
          position: lngLat
        })
        .then(response => {
          const address = response.addresses[0].address.freeformAddress;
          setAddressFormData(prev => ({ ...prev, address: address }));
        })
        .catch(err => {
          console.error("Lỗi Reverse Geocode:", err);
        });
      };

      // Thêm sự kiện click
      map.on('click', (e) => {
        marker.setLngLat(e.lngLat);
        updateAddressFromMap(e.lngLat);
      });

      // Thêm sự kiện kéo thả ghim
      marker.on('dragend', () => {
        const lngLat = marker.getLngLat();
        updateAddressFromMap(lngLat);
      });
      
      // Lưu instance vào ref để dùng sau
      mapInstanceRef.current = map;
      markerRef.current = marker;

    
      //updateAddressFromMap(centerCoords); 
    };
    // --- KẾT THÚC HÀM KHỞI TẠO MAP ---

    
    // --- BẮT ĐẦU LẤY VỊ TRÍ ---
    const defaultCoords = { lon: 106.660172, lat: 10.762622 }; // (TP. HCM)

    if (navigator.geolocation) {
      // HỎI XIN VỊ TRÍ
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // THÀNH CÔNG: Lấy được vị trí
          const userCoords = { 
            lat: position.coords.latitude, 
            lon: position.coords.longitude 
          };
          setSelectedLatLon(defaultCoords);

          initializeMap(userCoords); // Khởi tạo map ở vị trí người dùng
        },
        (err) => {
          // THẤT BẠI: (Người dùng từ chối, v.v.)
          console.warn("Không thể lấy vị trí: ", err.message);
          toast.info("Không thể lấy vị trí của bạn. Đang dùng vị trí mặc định.");
          setSelectedLatLon(defaultCoords);

          initializeMap(defaultCoords); // Khởi tạo map ở TP. HCM
        },
        { timeout: 10000, enableHighAccuracy: true } // Cấu hình
      );
    } else {
      // TRÌNH DUYỆT CŨ: Không hỗ trợ geolocation
      console.warn("Trình duyệt không hỗ trợ Geolocation.");
      
      setSelectedLatLon(defaultCoords);
      initializeMap(defaultCoords); // Khởi tạo map ở TP. HCM
    }

  // Dependency: Chạy lại nếu 'activeTab' đổi (để tạo map khi chuyển tab)
  }, [isSdkLoaded, activeTab]); 


  // =======================================================
  // MỚI: SỬA LỖI ZOOM/CLICK LỆCH (bản cuối)
  // (Sử dụng ResizeObserver)
  // =======================================================
  useEffect(() => {
    // Chỉ chạy nếu:
    // 1. Tab 'addresses' đang mở
    // 2. Map ĐÃ được khởi tạo (mapInstanceRef.current tồn tại)
    // 3. 'mapContainerRef.current' (thẻ div) tồn tại
    if (activeTab === 'addresses' && mapInstanceRef.current && mapContainerRef.current) {
      
      // Tạo một 'Observer' để theo dõi thẻ div
      const mapDiv = mapContainerRef.current;
      const observer = new ResizeObserver(() => {
        // Bất cứ khi nào div thay đổi kích thước,
        // gọi map.resize()
        if (mapInstanceRef.current) {
          mapInstanceRef.current.resize();
        }
      });

      // Bắt đầu theo dõi
      observer.observe(mapDiv);

      // Cleanup: Ngừng theo dõi khi component unmount
      return () => {
        observer.unobserve(mapDiv);
      };
    }
  }, [activeTab]); // Phụ thuộc vào activeTab (và các ref)
  // =======================================================
  // KẾT THÚC SỬA
  // =======================================================


  // --- XỬ LÝ TAB HỒ SƠ ---
  const handleProfileFormChange = (e) => {
    const { name, value } = e.target;
    // =======================================================
    // MỚI: Chỉ cho phép nhập số và tối đa 11 ký tự cho phoneNumber
    // =======================================================
    if (name === 'phoneNumber') {
      const numericValue = value.replace(/[^0-9]/g, ''); // Chỉ giữ lại số
      if (numericValue.length <= 11) { // Giới hạn 11 số
        setProfileFormData(prev => ({ ...prev, [name]: numericValue }));
      }
    } else {
      setProfileFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleProfileUpdate = async () => {
    setIsLoading(true);
    const { phoneNumber } = profileFormData;

    // Regex cho SĐT Việt Nam: Bắt đầu bằng 0, theo sau là 9 số (Tổng 10 số)
    const vietnamPhoneRegex = /^0\d{9}$/;

    // Kiểm tra: Nếu SĐT *có* được nhập (không rỗng) VÀ nó *không* khớp regex
    // (Chúng ta cho phép SĐT rỗng, vì CSDL là NULLable)
    if (phoneNumber && phoneNumber.trim() !== '' && !vietnamPhoneRegex.test(phoneNumber)) {
        // Hiển thị lỗi và dừng lại
        toast.error("Số điện thoại không hợp lệ. SĐT chuẩn phải bắt đầu bằng 0 và có 10 chữ số.");
        setIsLoading(false);
         // Dừng, không gọi API
    }
    else{
    try {
        const response = await axios.put(`${API_BASE_URL}/api/v1/users/me`, profileFormData, {
            headers: createAuthHeaders()
        });
        setUserData(response.data); 
        setIsEditingProfile(false); 
        toast.success("Cập nhật hồ sơ thành công!");
    } catch (error) {
        toast.error(error.response?.data || "Cập nhật thất bại.");
    } finally {
        setIsLoading(false);
    }}
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    setProfileFormData({
        fullName: userData.fullName || '',
        phoneNumber: userData.phoneNumber || ''
    });
  };

  // --- XỬ LÝ TAB ĐỊA CHỈ ---

  // Xử lý Form Địa chỉ
  const handleAddressFormChange = (e) => {
    const { name, value } = e.target;
    
    setAddressFormData(prev => ({ ...prev, [name]: value }));
    if (addressError) setAddressError('');

    // Fuzzy Search (cho ô 'address')
    if (name === 'address') {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (!value.trim()) {
        setSearchResults([]);
        return;
      }
      debounceTimerRef.current = setTimeout(() => {
        if (!window.tt || !window.tt.services || !TOMTOM_API_KEY) return;
        
        window.tt.services.fuzzySearch({
          key: TOMTOM_API_KEY,
          query: value,
          countrySet: 'VN' 
        })
        .then(response => {
          setSearchResults(response.results || []);
        });
      }, 300);
    }
  };

  // Xử lý Click vào Gợi ý
  const handleSearchResultClick = (result) => {
    // Lính gác 1: Kiểm tra result
    if (!result || !result.address || !result.position) {
      console.error("Clicked on a malformed search result:", result);
      return; 
    }

    const { freeformAddress } = result.address;
    const { lat, lng } = result.position;

    setAddressFormData(prev => ({ ...prev, address: freeformAddress }));
    setSelectedLatLon({ lat:lat, lon:lng });
    setSearchResults([]);

    // Lính gác 2: Kiểm tra map
    if (mapInstanceRef.current && markerRef.current) {
      const newLngLat = [lng, lat];
      mapInstanceRef.current.flyTo({ center: newLngLat, zoom: 16 });
      markerRef.current.setLngLat(newLngLat);
    } else {
      console.warn("Map instance chưa sẵn sàng khi click vào gợi ý.");
    }
  };


  // Xử lý Thêm Địa chỉ
  const handleAddressAdd = async (e) => {
    e.preventDefault();
    if (!addressFormData.addressName || !addressFormData.address) {
        toast.error("Tên và địa chỉ không được để trống.")
        setAddressError("Tên và địa chỉ không được để trống.");
        return;
    }
    if (!selectedLatLon.lat || !selectedLatLon.lon) {
      toast.error("Vui lòng chọn một vị trí trên bản đồ hoặc từ danh sách gợi ý.")
        setAddressError("Vui lòng chọn một vị trí trên bản đồ hoặc từ danh sách gợi ý.");
        return;
    }

    setIsLoading(true);
    try {
        const response = await axios.post(`${API_BASE_URL}/api/v1/users/me/addresses`, {
            addressName: addressFormData.addressName,
            address: addressFormData.address,
            latitude: selectedLatLon.lat, 
            longitude: selectedLatLon.lon
        }, {
            headers: createAuthHeaders()
        });

        setAddresses(prev => [...prev, response.data]);
        setAddressFormData({ addressName: '', address: '' }); 
        setSelectedLatLon({ lat: null, lon: null });
        toast.success("Thêm địa chỉ thành công!");

    } catch (error) {
        console.error("Lỗi thêm địa chỉ:", error);
        toast.error(error.response?.data || "Thêm địa chỉ thất bại.");
    } finally {
        setIsLoading(false);
    }
  };

 // =======================================================
  // SỬA: Tách logic Xóa (Thay thế window.confirm)
  // =======================================================
  
  // Bước 1: Mở Modal
  const triggerDeleteAddress = (address) => {
    setAddressToDelete(address); // Lưu địa chỉ (object)
    setIsConfirmModalOpen(true); // Mở modal
};

// Bước 2: Hủy (đóng modal)
const cancelDelete = () => {
    setIsConfirmModalOpen(false);
    setAddressToDelete(null);
};

// Bước 3: Xác nhận (gọi API)
const confirmAddressDelete = async () => {
  if (!addressToDelete) return; // An toàn

  setIsLoading(true);
  setIsConfirmModalOpen(false); // Đóng modal

  try {
      await axios.delete(`${API_BASE_URL}/api/v1/users/me/addresses/${addressToDelete.id}`, {
          headers: createAuthHeaders()
      });
      setAddresses(prev => prev.filter(addr => addr.id !== addressToDelete.id));
      toast.success("Đã xóa địa chỉ.");
  } catch (error) {
      toast.error(error.response?.data || "Xóa địa chỉ thất bại.");
  } finally {
      setIsLoading(false);
      setAddressToDelete(null); // Reset
  }
};
  // Xử lý Đặt Mặc Định
  const handleSetDefaultAddress = async (addressId) => {
    setIsLoading(true);
    try {
        await axios.put(`${API_BASE_URL}/api/v1/users/me/addresses/${addressId}/set-default`, {}, {
            headers: createAuthHeaders()
        });

        setAddresses(prevAddresses => 
            prevAddresses.map(addr => ({
                ...addr,
                isDefault: addr.id === addressId 
            }))
        );

        toast.success("Đã đặt làm địa chỉ mặc định!");

    } catch (error) {
        console.error("Lỗi đặt địa chỉ mặc định:", error);
        toast.error(error.response?.data || "Đặt mặc định thất bại.");
    } finally {
        setIsLoading(false);
    }
  };

  // Xử lý "Xem trên bản đồ"
  const handleViewAddressOnMap = (address) => {
    // Lính gác 1: Kiểm tra map/marker đã sẵn sàng
    if (!mapInstanceRef.current || !markerRef.current) {
      toast.error("Bản đồ chưa được tải xong, vui lòng thử lại.");
      return;
    }

    // Lính gác 2: Kiểm tra địa chỉ có tọa độ không (từ CSDL)
    if (!address.latitude || !address.longitude) {
      toast.info("Địa chỉ này chưa có tọa độ (lat/lon) để ghim.");
      return;
    }

    const lngLat = [address.longitude, address.latitude];

    // 1. Bay tới vị trí
    mapInstanceRef.current.flyTo({ center: lngLat, zoom: 17 });
    
    // 2. Di chuyển ghim
    markerRef.current.setLngLat(lngLat);

    // 3. Cập nhật form (tùy chọn: giúp người dùng biết họ đang xem gì)
    setAddressFormData({
      addressName: address.addressName,
      address: address.address
    });
    setSelectedLatLon({
      lat: address.latitude,
      lon: address.longitude
    });

    // 4. Cuộn lên bản đồ
    mapContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };


  // --- ĐỊNH NGHĨA CSS CHO TRANG NÀY ---
  const allStyles = `
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
    
    /* CSS Mới cho Trang Hồ Sơ */
    .user-profile-page {
      max-width: 900px;
      margin: 40px auto;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }
    .profile-header {
      font-size: 2rem;
      font-weight: 700;
      color: #333;
      border-bottom: 2px solid #f0f0f0;
      padding-bottom: 15px;
      margin-bottom: 25px;
    }
    
    /* CSS cho Tabs */
    .profile-tabs {
      display: flex;
      border-bottom: 2px solid #e0e0e0;
      margin-bottom: 30px;
    }
    .profile-tab-btn {
      padding: 12px 20px;
      font-size: 1.1rem;
      font-weight: 600;
      color: #777;
      background: none;
      border: none;
      cursor: pointer;
      margin-bottom: -2px; /* Nâng tab lên đè lên border */
      border-bottom: 3px solid transparent;
      transition: all 0.3s ease;
    }
    .profile-tab-btn:hover {
      color: black;
    }
    .profile-tab-btn.active {
      color: black;
      border-bottom-color:black;
    }

    /* CSS cho Nội dung Tab */
    .profile-content h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #444;
      margin-bottom: 20px;
    }

    /* CSS cho Form Hồ Sơ */
    .profile-info-form {
      background: #fafafa;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 25px;
    }
    .form-row {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
    }
    .form-row label {
      font-weight: 600;
      color: #555;
      flex-basis: 150px; /* Cố định chiều rộng của label */
    }
    .form-row .form-value {
      flex-grow: 1;
      font-size: 1rem;
      color: #333;
    }
    .form-row input[type="text"] {
      flex-grow: 1;
      padding: 10px 12px;
      border: 1px solid #ccc;
      border-radius: 6px;
      font-size: 1rem;
    }
    /* Style cho input không thể sửa (username, email) */
    .form-row input[disabled] {
      background: #eee;
      color: #777;
      cursor: not-allowed;
    }

    /* CSS cho các nút (Chỉnh sửa, Lưu, Hủy) */
    .form-actions {
      display: flex;
      gap: 10px; /* Khoảng cách giữa các nút */
      margin-top: 20px;
    }
    .btn-primary {
      padding: 10px 20px;
      border: none;
      border-radius: 6px;
      background-color: #222;
      color: white;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    
    .btn-primary:hover {
      background-color: #444;
    }
    .btn-secondary {
      padding: 10px 20px;
      border: 1px solid #ccc;
      border-radius: 6px;
      background-color: #fff;
      color: #555;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
    }

    /* CSS cho Tab Địa Chỉ */
    .address-add-form {
      background: #fafafa;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 25px;
      margin-bottom: 30px;
    }
    .address-add-form .form-group {
      margin-bottom: 15px;
    }
    .address-add-form label {
      display: block;
      margin-bottom: 5px;
      font-weight: 600;
      color: #555;
    }
    .address-add-form input[type="text"],
    .address-add-form textarea {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #ccc;
      border-radius: 6px;
      font-size: 1rem;
      box-sizing: border-box; /* Quan trọng */
    }
    .address-add-form textarea {
      min-height: 80px;
      resize: vertical;
    }
    .validation-error {
      font-size: 13px;
      color: red;
      display: inline-block;
      margin-top: 5px;
    }

    /* CSS cho Danh sách địa chỉ đã lưu */
    .address-list {
      display: grid;
      grid-template-columns: 1fr; /* 1 cột trên mobile */
      gap: 15px;
    }
    /* 2 cột trên desktop */
    @media (min-width: 768px) {
      .address-list {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    .address-item {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 20px;
      display: flex;
      flex-direction: column; /* Đổi sang cột */
    }
    
    /* MỚI: CSS cho phần Header (Tên, Mặc định) */
    .address-item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      margin-bottom: 10px;
    }
    .address-item-name {
      font-size: 1.1rem;
      font-weight: bold;
      color: #333;
    }
    .address-default-badge {
      background-color: #28a745; /* Màu xanh lá */
      color: white;
      font-size: 0.8rem;
      font-weight: bold;
      padding: 4px 8px;
      border-radius: 12px;
    }

    .address-item-info p {
      margin: 0 0 15px 0; /* Thêm margin-bottom */
      color: #666;
    }
    .address-item-info small {
      color: #888;
    }

    /* MỚI: CSS cho phần Actions (Xóa, Đặt Mặc định) */
    .address-item-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      border-top: 1px solid #f0f0f0;
      padding-top: 10px;
    }
    /* MỚI: Div bọc cho các nút bên trái */
    .address-item-actions-left {
        display: flex;
        flex-wrap: wrap; /* Cho phép xuống dòng nếu không đủ chỗ */
        gap: 10px; /* Khoảng cách giữa các nút */
    }
    .address-set-default-btn {
      background: none;
      border: none;
      color: #007bff;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.9rem;
      padding: 0; /* Reset padding */
      display: flex;
      align-items: center;
    }
    .address-set-default-btn:disabled {
      color: #aaa;
      cursor: not-allowed;
    }
    /* MỚI: CSS cho nút xem bản đồ */
    .address-view-map-btn {
      background: none;
      border: none;
      color: #17a2b8; /* Màu info */
      cursor: pointer;
      font-weight: 600;
      font-size: 0.9rem;
      padding: 0; /* Reset padding */
      display: flex;
      align-items: center;
    }
    .address-view-map-btn:disabled {
        color: #aaa;
        cursor: not-allowed;
    }

    .address-delete-btn {
      background: none;
      border: none;
      color: #dc3545;
      cursor: pointer;
      font-size: 1.2rem;
      padding: 5px;
    }

    /* ================================== */
    /* MỚI: CSS CHO TOMTOM MAP VÀ SEARCH */
    /* ================================== */
    
    /* Thông báo lỗi nếu thiếu API Key */
    .api-key-error {
        padding: 15px;
        background-color: #ffebee; /* Màu đỏ nhạt */
        color: #c62828; /* Màu đỏ đậm */
        border: 1px solid #c62828;
        border-radius: 8px;
        font-weight: 500;
        text-align: center;
        margin-bottom: 20px;
    }

    /* Container cho bản đồ */
    .map-container {
      height: 350px; /* Đặt chiều cao cố định cho bản đồ */
      width: 100%;
      border-radius: 8px;
      overflow: hidden; /* Đảm bảo góc tròn */
      margin-top: 15px;
    }

    /* Ghi đè style của TomTom popup (nếu cần) */
    .tomtom-sdk-map-popup-content {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
    }

    /* Container cho ô search (để chứa gợi ý) */
    .address-search-wrapper {
      position: relative;
    }

    /* Danh sách gợi ý (Fuzzy Search Results) */
    .search-results-container {
      position: absolute;
      width: 100%;
      background: #fff;
      border: 1px solid #ddd;
      border-top: none;
      border-radius: 0 0 8px 8px;
      box-shadow: 0 5px 10px rgba(0,0,0,0.1);
      z-index: 1000;
      /* Dùng max-height để cuộn nếu có quá nhiều kết quả */
      max-height: 250px;
      overflow-y: auto;
    }

    .search-result-item {
      padding: 12px 15px;
      cursor: pointer;
      font-size: 0.95rem;
      border-bottom: 1px solid #f0f0f0;
    }
    .search-result-item:last-child {
      border-bottom: none;
    }
    .search-result-item:hover {
      background-color: #f5f5f5;
    }
    .search-result-item strong {
      color: #007bff; /* Nổi bật phần khớp */
    }

    /* ================================== */
    /* MỚI: CSS CHO CUSTOM MARKER (GHIM) */
    /* ================================== */
    .custom-marker {
        width: 20px;
        height: 20px;
        background-color: #E74C3C; /* Màu đỏ */
        border: 2px solid #FFFFFF;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        cursor: grab;
    }
    .custom-marker:active {
        cursor: grabbing;
    }
    .confirm-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
  }
  .confirm-modal-box {
      background: #fff;
      padding: 25px;
      border-radius: 8px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.3);
      width: 100%;
      max-width: 400px;
      animation: modal-fade-in 0.2s ease-out;
  }
  .confirm-modal-header {
      display: flex;
      align-items: center;
      font-size: 1.3rem;
      color: #333;
      border-bottom: 1px solid #f0f0f0;
      padding-bottom: 15px;
      margin-bottom: 15px;
  }
  .confirm-modal-header h3 {
      margin: 0 0 0 10px; /* Thêm margin-left thay vì 0 */
  }
  .confirm-modal-body p {
      font-size: 1rem;
      color: #555;
      line-height: 1.5;
      margin: 0;
  }
  .confirm-modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 25px;
  }

  @keyframes modal-fade-in {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  `;

  // --- RENDER JSX ---
  return (
    <>
      <StyleInjector styles={allStyles} />
      <LoadingSpinner isLoading={isLoading} />
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={cancelDelete} // Nút Hủy
        onConfirm={confirmAddressDelete} // Nút Xác nhận
        title="Xác nhận xóa"
        message={`Bạn có chắc chắn muốn xóa địa chỉ "${addressToDelete?.addressName}" không? Hành động này không thể hoàn tác.`}
      />

      <Header/>
      <div className="user-profile-page" >
        <h3 className="profile-header">Tài khoản của bạn</h3>

        {/* Tabs */}
        <div className="profile-tabs">
          <button 
            className={`profile-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <FontAwesomeIcon icon={faUser} />
            Thông tin cá nhân
          </button>
          <button 
            className={`profile-tab-btn ${activeTab === 'addresses' ? 'active' : ''}`}
            onClick={() => setActiveTab('addresses')}
          >
            <FontAwesomeIcon icon={faLocationDot} />
            Sổ địa chỉ
          </button>
        </div>

        {/* Nội dung Tabs */}
        <div className="profile-content">

          {/* === TAB 1: THÔNG TIN CÁ NHÂN === */}
          {activeTab === 'profile' && (
            <div>
              {/* (Code Tab 1 giữ nguyên... ) */}
              <h3>Hồ sơ của bạn</h3>
              <form className="profile-info-form" >
                <div className="form-row">
                  <label>Username</label>
                  <input type="text" value={userData.username || ''} disabled />
                </div>
                <div className="form-row">
                  <label>Email</label>
                  <input type="text" value={userData.email || ''} disabled />
                </div>
                <div className="form-row">
                  <label htmlFor="fullName">Họ và Tên</label>
                  {!isEditingProfile ? (
                    <span className="form-value">{userData.fullName || 'Chưa cập nhật'}</span>
                  ) : (
                    <input type="text" id="fullName" name="fullName" value={profileFormData.fullName} onChange={handleProfileFormChange} />
                  )}
                </div>
                <div className="form-row">
                  <label htmlFor="phoneNumber">Số điện thoại</label>
                  {!isEditingProfile ? (
                    <span className="form-value">{userData.phoneNumber || 'Chưa cập nhật'}</span>
                  ) : (
                    <input 
                        type="text" // Vẫn là 'text'
                        id="phoneNumber" 
                        name="phoneNumber" 
                        value={profileFormData.phoneNumber} 
                        onChange={handleProfileFormChange} 
                        placeholder="Chỉ nhập số, tối đa 11 số"
                        pattern="\d*" // Gợi ý bàn phím số
                    />
                  )}
                </div>
                <div className="form-actions">
                  {!isEditingProfile ? (
                    <button type="button" className="btn-primary" onClick={() => setIsEditingProfile(true)}>
                      Chỉnh sửa hồ sơ</button>
                  ) :
                   (
                    <>
                      <button type="button" className="btn-primary" onClick={handleProfileUpdate} >
                        {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                      </button>
                      <button type="button" className="btn-secondary" onClick={handleCancelEdit}>
                        Hủy
                      </button>
                    </>
                  )
                  }
                </div>
              </form>
            </div>
          )}

          {/* === TAB 2: SỔ ĐỊA CHỈ === */}
          {activeTab === 'addresses' && (
            <div>
              <h3>Thêm địa chỉ mới</h3>

              {/* Thông báo nếu thiếu API Key */}
              {!TOMTOM_API_KEY && (
                <div className="api-key-error">
                  Lỗi: REACT_APP_TOMTOM_API_KEY chưa được cấu hình.
                  Không thể tải bản đồ.
                </div>
              )}

              <form className="address-add-form" onSubmit={handleAddressAdd}>
                <div className="form-group">
                  <label htmlFor="addressName">Tên địa chỉ (ví dụ: Nhà, Công ty...)</label>
                  <input 
                    type="text" 
                    id="addressName" 
                    name="addressName"
                    value={addressFormData.addressName}
                    onChange={handleAddressFormChange}
                    placeholder="Nhà riêng"
                  />
                </div>
                
                {/* ================================== */}
                {/* MỚI: Ô SEARCH ĐỊA CHỈ + GỢI Ý */}
                {/* ================================== */}
                <div className="form-group address-search-wrapper">
                  <label htmlFor="address">Địa chỉ chi tiết</label>
                  <textarea 
                    id="address" 
                    name="address"
                    value={addressFormData.address}
                    onChange={handleAddressFormChange}
                    placeholder="Nhập địa chỉ của bạn để tìm kiếm..."
                    autoComplete="off"
                  />
                  {/* Hiển thị danh sách gợi ý (Fuzzy Search) */}
                  {searchResults.length > 0 && (
                    <div className="search-results-container">
                      {searchResults.map(result => (
                        <div 
                          key={result.id} 
                          className="search-result-item"
                          onClick={() => handleSearchResultClick(result)}
                        >
                          {/* SỬA: Thêm kiểm tra optional chaining */}
                          {result?.address?.freeformAddress || 'Địa chỉ không xác định'}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {addressError && <p className="validation-error">{addressError}</p>}
                
                {/* ================================== */}
                {/* MỚI: BẢN ĐỒ TOMTOM */}
                {/* ================================== */}
                <label>Hoặc chọn trên bản đồ:</label>
                <div 
                  id="tomtom-map" 
                  ref={mapContainerRef} 
                  className="map-container"
                >
                  {/* Bản đồ sẽ được tải vào đây */}
                </div>

                <button type="submit" style={{marginTop:'30px'}} className="btn-primary" disabled={isLoading}>
                  {isLoading ? 'Đang thêm...' : 'Thêm địa chỉ'}
                </button>
              </form>

              {/* ================================== */}
              {/* SỬA: DANH SÁCH ĐỊA CHỈ ĐÃ LƯU */}
              {/* ================================== */}
              <h3>Địa chỉ đã lưu</h3>
              <div className="address-list">
                {addresses.length === 0 ? (
                  <p>Bạn chưa lưu địa chỉ nào.</p>
                ) : (
                  addresses.map(addr => (
                    <div className="address-item" key={addr.id}>
                      {/* Phần Header (Tên + Mặc định) */}
                      <div className="address-item-header">
                        <span className="address-item-name">{addr.addressName}</span>
                        {addr.isDefault && (
                          <span className="address-default-badge">Mặc định</span>
                        )}
                      </div>

                      {/* Phần Thông tin (Địa chỉ, Lat/Lon) */}
                      <div className="address-item-info">
                        <p>{addr.address}</p>
                        {addr.latitude && (
                          <small>
                            [{addr.latitude}, {addr.longitude}]
                          </small>
                        )}
                      </div>

                      {/* Phần Actions (Xóa, Đặt Mặc định) */}
                      <div className="address-item-actions">
                        {/* ================================== */}
                        {/* MỚI: Thêm div bọc trái */}
                        {/* ================================== */}
                        <div className="address-item-actions-left">
                          {/* Nút Đặt Mặc định */}
                          {!addr.isDefault ? (
                              <button
                                  className="address-set-default-btn"
                                  onClick={() => handleSetDefaultAddress(addr.id)}
                                  disabled={isLoading}
                              >
                                  <FontAwesomeIcon icon={faStar} style={{color: '#007bff'}} />
                                  Đặt làm mặc định
                              </button>
                          ) : (
                              null // Đã sửa lỗi
                          )}
                          
                          {/* ================================== */}
                          {/* MỚI: Nút Xem Bản Đồ */}
                          {/* ================================== */}
                          {addr.latitude && ( // Chỉ hiển thị nếu có tọa độ
                            <button
                                className="address-view-map-btn"
                                onClick={() => handleViewAddressOnMap(addr)}
                                disabled={isLoading}
                            >
                                <FontAwesomeIcon icon={faLocationCrosshairs} style={{color: '#17a2b8'}} />
                                Xem bản đồ
                            </button>
                          )}
                        </div>
                        
                        {/* Nút Xóa (bên phải) */}
                        <button 
                          className="address-delete-btn" 
                          onClick={() => triggerDeleteAddress(addr)}
                          disabled={isLoading}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
import React, { useState, useEffect, useRef, useCallback } from 'react';
import LoadingSpinner from '../../components/common/LoadingSpinner/LoadingSpinner';

import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
// =======================================================
// MỚI: Import hook 'useCart' thật (dựa trên Cart.jsx)
// =======================================================
import { useCart } from '../../hooks/useCart';

// Đặt URL backend của bạn ở đây
const API_BASE_URL = 'http://localhost:8888';
// Lấy API key từ file .env
const TOMTOM_API_KEY = process.env.REACT_APP_TOMTOM_API_KEY;
const getAuthToken = () => localStorage.getItem('user');
console.log(getAuthToken())
const createAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};
const formatCurrency = (value) => {
  if (!value) return "0 ₫";
  return value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
};

// --- CÁC COMPONENT TỰ CHỨA ĐỂ KHẮC PHỤC LỖI IMPORT ---
// (Copy từ UserProfilePage.jsx)

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



// 3. Component FontAwesomeIcon và Icons (Giả lập)
const faUser = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="1em" height="1em" fill="currentColor"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" /></svg>
);
const faMapMarkerAlt = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="1em" height="1em" fill="currentColor"><path d="M172.3 501.7C27 399.4 0 364.5 0 288 0 128.9 128.9 0 288 0c19.4 0 37.9 1.9 55.4 5.4 17.1 3.4 33.6 8.5 49.3 15.1 16.2 6.8 31.4 15.3 45.4 25.4 13.4 9.8 25.5 21.2 36.1 33.8 10.9 12.9 20.3 27.2 28.1 42.7 8.3 16.3 15.1 33.7 20.2 51.8 4.7 16.8 8.1 34.3 10.2 52.3 2.5 21.2 3.8 42.9 3.8 64.9 0 76.5-27 111.4-172.3 213.7C203.4 518.1 180.6 518.1 172.3 501.7zM288 128c-35.3 0-64 28.7-64 64s28.7 64 64 64 64-28.7 64-64-28.7-64-64-64z" /></svg>
);
const faMoneyBillWave = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="1em" height="1em" fill="currentColor"><path d="M0 112.5V422.3c0 18 10.1 35 27 41.3C83.2 482.7 180.3 512 288 512s204.8-29.3 261-48.5c17-6.3 27-23.4 27-41.3V89.7c0-18-10.1-35-27-41.3C483.2 29.3 386.1 0 288 0S83.2 29.3 27 48.5C10.1 54.8 0 71.8 0 89.7v22.8zM288 320a32 32 0 1 1 0-64 32 32 0 1 1 0 64zM160 320a32 32 0 1 1 0-64 32 32 0 1 1 0 64zM416 320a32 32 0 1 1 0-64 32 32 0 1 1 0 64z" /></svg>
);
const faCreditCard = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="1em" height="1em" fill="currentColor"><path d="M512 80c8.8 0 16 7.2 16 16v320c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V96c0-8.8 7.2-16 16-16H512zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM256 352c-17.7 0-32 14.3-32 32s14.3 32 32 32s32-14.3 32-32s-14.3-32-32-32zM320 352c-17.7 0-32 14.3-32 32s14.3 32 32 32s32-14.3 32-32s-14.3-32-32-32zM384 352c-17.7 0-32 14.3-32 32s14.3 32 32 32s32-14.3 32-32s-14.3-32-32-32z" /></svg>
);
const faTag = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="1em" height="1em" fill="currentColor"><path d="M0 80V224c0 17.7 14.3 32 32 32H160c17.7 0 32-14.3 32-32V80c0-17.7-14.3-32-32-32H32C14.3 48 0 62.3 0 80zM128 160a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM319.1 32c-13.3-13.3-31-20.9-49.8-20.9H192c-17.7 0-32 14.3-32 32V192c0 17.7 14.3 32 32 32H320c17.7 0 32-14.3 32-32V132.9c0-18.8-7.6-36.5-20.9-49.8L319.1 32zM288 128a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zM160 320c17.7 0 32-14.3 32-32V80c0-17.7-14.3-32-32-32H32C14.3 48 0 62.3 0 80V288c0 17.7 14.3 32 32 32H160zM32 384H160c17.7 0 32-14.3 32-32V288c0-17.7-14.3-32-32-32H32C14.3 256 0 270.3 0 288V384c0 35.3 28.7 64 64 64H160v32c0 17.7 14.3 32 32 32s32-14.3 32-32V416c0-35.3-28.7-64-64-64H32V384zM384 288c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32H416c35.3 0 64-28.7 64-64V288c0-17.7-14.3-32-32-32H384zm0 64H416v32c0 8.8-7.2 16-16 16H384V352z" /></svg>
);


const FontAwesomeIcon = ({ icon, style }) => {
  return (
    <span style={{ ...style, display: 'inline-block', width: '1em', height: '1em', verticalAlign: 'middle', marginRight: '8px' }}>
      {icon}
    </span>
  );
};
// --- KẾT THÚC COMPONENT TỰ CHỨA ---

// (Xóa 'useCart' giả lập)

export default function CheckoutPage() {
  // SỬA: Gọi hook 'useCart' thật
  const { cartItems, getTotal } = useCart(); // Tải giỏ hàng thật

  // State cho Form
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
    addressName: 'Địa chỉ giao hàng' // Tên mặc định
  });
  const [savedAddresses, setSavedAddresses] = useState([]); // List địa chỉ đã lưu
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [email, setEmail] = useState('');


  // State cho Vị trí
  const [selectedLatLon, setSelectedLatLon] = useState({ lat: null, lon: null });

  // State cho Thanh toán
  const [paymentMethod, setPaymentMethod] = useState('COD'); // 'COD' hoặc 'ONLINE'

  // State cho Coupon
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { code: '...', discountAmount: 50000 }
  const [isCheckingCoupon, setIsCheckingCoupon] = useState(false);

  // State chung
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // State & Refs cho TomTom Map
  const [isSdkLoaded, setIsSdkLoaded] = useState(!!(window.tt && window.tt.services));
  const [searchResults, setSearchResults] = useState([]);
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const currentLatLonRef = useRef({ lat: null, lon: null });

  // --- Tải SDK (Giống UserProfile) ---
  useEffect(() => {
    if (isSdkLoaded) return;
    const loadSDK = () => {
      const cssLink = document.createElement('link');
      cssLink.rel = 'stylesheet';
      cssLink.href = 'https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.25.0/maps/maps.css';
      cssLink.id = 'tomtom-maps-css';
      document.head.appendChild(cssLink);
      const mapScript = document.createElement('script');
      mapScript.src = 'https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.25.0/maps/maps-web.min.js';
      mapScript.async = true;
      mapScript.id = 'tomtom-maps-js';
      mapScript.onload = () => {
        const servicesScript = document.createElement('script');
        servicesScript.src = 'https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.25.0/services/services-web.min.js';
        servicesScript.async = true;
        servicesScript.id = 'tomtom-services-js';
        servicesScript.onload = () => setIsSdkLoaded(true);
        servicesScript.onerror = () => toast.error("Không thể tải SDK dịch vụ bản đồ.");
        document.body.appendChild(servicesScript);
      };
      mapScript.onerror = () => toast.error("Không thể tải SDK bản đồ.");
      document.body.appendChild(mapScript);
    };
    if (!window.tt) loadSDK();
    else setIsSdkLoaded(true);
    return () => {
      const scriptMap = document.getElementById('tomtom-maps-js');
      const scriptServices = document.getElementById('tomtom-services-js');
      const cssEl = document.getElementById('tomtom-maps-css');
      if (scriptMap) document.body.removeChild(scriptMap);
      if (scriptServices) document.body.removeChild(scriptServices);
      if (cssEl) document.head.removeChild(cssEl);
    };
  }, [isSdkLoaded]);

  // --- Tải Dữ liệu Checkout (User + Địa chỉ) ---
  const fetchCheckoutData = useCallback(async () => {
    setIsLoading(true);
    const headers = createAuthHeaders();
    if (Object.keys(headers).length === 0) {
      // Tắt loading nếu không đăng nhập (khách vãng lai)
      setIsLoading(false);
      // toast.info("Bạn đang thanh toán với tư cách khách.");
      return;
    }
    try {
      const [userResponse, addressResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/v1/users/me`, { headers }),
        axios.get(`${API_BASE_URL}/api/v1/users/me/addresses`, { headers })
      ]);

      const user = userResponse.data;
      setEmail(user.email);
      const addresses = addressResponse.data || [];
      // 1. Điền thông tin user
      setFormData(prev => ({
        ...prev,
        fullName: user.fullName || '',
        phoneNumber: user.phoneNumber || ''
      }));

      // 2. Tải danh sách địa chỉ
      setSavedAddresses(addresses);

      // 3. TỰ ĐỘNG CHỌN địa chỉ mặc định (nếu có)
      const defaultAddress = addresses.find(addr => addr.isDefault);
      if (defaultAddress) {
      }

    } catch (error) {
      console.error("Lỗi tải dữ liệu checkout:", error);
      toast.error(error.response?.data || "Lỗi tải dữ liệu.");
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('accessToken');
        navigate('/login', { state: { message: "Phiên đăng nhập đã hết hạn." } });
      }
    } finally {
      setIsLoading(false);
    }
    // SỬA: Bỏ navigate khỏi dependency, chỉ fetch 1 lần
  }, []);

  useEffect(() => {
    fetchCheckoutData();
  }, [fetchCheckoutData]);

  // --- Khởi tạo bản đồ (Giống UserProfile) ---
  useEffect(() => {
    if (!isSdkLoaded || !TOMTOM_API_KEY || mapInstanceRef.current) {
      return; // Chỉ khởi tạo 1 lần
    }

    // Hàm khởi tạo map (sẽ được gọi sau)
    const initializeMap = (centerCoords) => {
      if (!mapContainerRef.current) return; // Kiểm tra an toàn
      const map = window.tt.map({
        key: TOMTOM_API_KEY,
        container: mapContainerRef.current,
        center: centerCoords,
        zoom: 15
      });
      const markerEl = document.createElement('div');
      markerEl.className = 'custom-marker';
      const marker = new window.tt.Marker({
        element: markerEl,
        anchor: 'bottom',
        draggable: true
      })
        .setLngLat(centerCoords)
        .addTo(map);

      // Hàm Reverse Geocode
      const updateAddressFromMap = (lngLat) => {
        setSelectedLatLon({ lat: lngLat.lat, lon: lngLat.lng });
        currentLatLonRef.current = { lat: lngLat.lat, lon: lngLat.lng };

        if (!window.tt.services) return;
        window.tt.services.reverseGeocode({
          key: TOMTOM_API_KEY, position: lngLat
        })
          .then(response => {
            const address = response.addresses[0].address.freeformAddress;
            // CẬP NHẬT FORM
            setFormData(prev => ({ ...prev, address: address }));
            setSelectedAddressId(null); // Bỏ chọn (nếu đang chọn) địa chỉ đã lưu
          });
      };

      map.on('click', (e) => {
        marker.setLngLat(e.lngLat);
        updateAddressFromMap(e.lngLat);
      });
      marker.on('dragend', () => {
        const lngLat = marker.getLngLat();
        updateAddressFromMap(lngLat);
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;

      // Tự động reverse geocode cho vị trí đầu tiên
      // SỬA: Chỉ update nếu chưa có địa chỉ mặc định
      //   if (!selectedAddressId) {
      //     updateAddressFromMap(centerCoords); 
      //   }
    };

    // Lấy vị trí (mặc định hoặc của người dùng)
    const defaultCoords = { lon: 106.660172, lat: 10.762622 }; // (TP. HCM)

    // SỬA: Chỉ lấy vị trí nếu KHÔNG có địa chỉ mặc định
    if (selectedAddressId) {
      // (Chúng ta đã có địa chỉ mặc định từ fetchCheckoutData)
      // (initializeMap sẽ được gọi bởi handleSelectSavedAddress)
      // initializeMap(selectedAddressId)
      return;
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords = {
            lat: position.coords.latitude,
            lon: position.coords.longitude
          };
          initializeMap(userCoords);
        },
        (err) => {
          toast.info("Không thể lấy vị trí, dùng vị trí mặc định.");
          initializeMap(defaultCoords);
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    } else {
      initializeMap(defaultCoords);
    }
  }, [isSdkLoaded, selectedAddressId]); // Thêm selectedAddressId

  // SỬA LỖI ZOOM/CLICK LỆCH (bản cuối)
  useEffect(() => {
    if (mapInstanceRef.current && mapContainerRef.current) {
      const mapDiv = mapContainerRef.current;
      if (typeof ResizeObserver === 'undefined') {
        const resizeTimer = setTimeout(() => {
          if (mapInstanceRef.current) mapInstanceRef.current.resize();
        }, 100);
        return () => clearTimeout(resizeTimer);
      }
      const observer = new ResizeObserver(() => {
        if (mapInstanceRef.current) mapInstanceRef.current.resize();
      });
      observer.observe(mapDiv);
      return () => {
        if (observer) observer.unobserve(mapDiv);
      };
    }
  }, [mapInstanceRef.current]); // Chạy khi map được tạo


  // --- XỬ LÝ FORM ---

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // MỚI: Xử lý Fuzzy Search (Giống UserProfile)
  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({ ...prev, [name]: value }));
    setSelectedAddressId(null); // Bỏ chọn địa chỉ đã lưu

    if (name === 'address') {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      if (!value.trim()) {
        setSearchResults([]);
        return;
      }
      debounceTimerRef.current = setTimeout(() => {
        if (!window.tt || !window.tt.services || !TOMTOM_API_KEY) return;
        window.tt.services.fuzzySearch({
          key: TOMTOM_API_KEY, query: value, countrySet: 'VN'
        })
          .then(response => setSearchResults(response.results || []));
      }, 300);
    }
  };

  // MỚI: Xử lý Click Gợi ý (Giống UserProfile)
  const handleSearchResultClick = (result) => {
    if (!result || !result.address || !result.position) return;
    const { freeformAddress } = result.address;
    const { lat, lng } = result.position;

    setFormData(prev => ({ ...prev, address: freeformAddress }));
    console.log(lat, lng)

    setSelectedLatLon({ lat: lat, lon: lng });
    currentLatLonRef.current = { lat, lng };
    setSearchResults([]);
    if (mapInstanceRef.current && markerRef.current) {
      const newLngLat = [lng, lat];
      mapInstanceRef.current.flyTo({ center: newLngLat, zoom: 16 });
      markerRef.current.setLngLat(newLngLat);
    }
  };

  // =======================================================
  // MỚI: XỬ LÝ CHỌN ĐỊA CHỈ ĐÃ LƯU
  // =======================================================
  const handleSelectSavedAddress = (address) => {
    if (!address) {
      // (Xử lý nếu người dùng chọn "Nhập địa chỉ mới")
      setSelectedAddressId(null);
      setFormData(prev => ({ ...prev, address: '' }));
      setSelectedLatLon({ lat: null, lon: null });
      currentLatLonRef.current = { lat: null, lon: null };
      return;
    }

    // 1. Cập nhật Form
    setFormData(prev => ({
      ...prev,
      address: address.address // Cập nhật ô text
    }));
    // 2. Cập nhật state ID
    setSelectedAddressId(address.id);
    // 3. Cập nhật tọa độ
    const coords = { lat: address.latitude, lon: address.longitude };
    setSelectedLatLon(coords);
    currentLatLonRef.current = coords;

    // 4. Di chuyển bản đồ
    // SỬA: Kiểm tra xem map đã được tạo chưa
    if (mapInstanceRef.current && markerRef.current) {
      const newLngLat = [address.longitude, address.latitude];
      mapInstanceRef.current.flyTo({ center: newLngLat, zoom: 17 });
      markerRef.current.setLngLat(newLngLat);
    } else if (isSdkLoaded && mapContainerRef.current) { // SỬA: Chỉ khởi tạo nếu SDK đã load
      // Nếu map CHƯA được tạo (vì fetchCheckoutData chạy trước)
      // Chỉ cần khởi tạo map ở vị trí này
      console.log(1);
      const map = window.tt.map({
        key: TOMTOM_API_KEY,
        container: mapContainerRef.current,
        center: [address.longitude, address.latitude],
        zoom: 17
      });
      const markerEl = document.createElement('div');
      markerEl.className = 'custom-marker';
      const marker = new window.tt.Marker({
        element: markerEl,
        anchor: 'bottom',
        draggable: true
      })
        .setLngLat([address.longitude, address.latitude])
        .addTo(map);

      // (Thêm lại các event listener)
      map.on('click', (e) => {
        marker.setLngLat(e.lngLat);
        // (TODO: Cần định nghĩa lại updateAddressFromMap ở đây hoặc tái cấu trúc)
      });
      marker.on('dragend', () => {
        const lngLat = marker.getLngLat();
        // (TODO: Cần định nghĩa lại updateAddressFromMap ở đây hoặc tái cấu trúc)
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;
    }
  };

  // =======================================================
  // SỬA: XỬ LÝ ÁP DỤNG MÃ COUPON (Gửi cả Tạm tính)
  // =======================================================
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.warn("Vui lòng nhập mã giảm giá.");
      return;
    }

    // Lấy Tạm tính (subtotal) HIỆN TẠI
    const currentSubtotal = getTotal();
    console.log(couponCode)
    setIsCheckingCoupon(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/promotions/apply`,
        {
          code: couponCode,
          subtotal: currentSubtotal // Gửi Tạm tính
        },
        { headers: createAuthHeaders() }
      );

      setAppliedCoupon(response.data);
      toast.success(`Đã áp dụng mã "${response.data.code}"!`);

    } catch (error) {
      console.error("Lỗi áp dụng coupon:", error);
      toast.error(error.response?.data || "Mã không hợp lệ hoặc đã hết hạn.");
      setAppliedCoupon(null);
    } finally {
      setIsCheckingCoupon(false);
    }
  };

  // =======================================================
  // TÍNH TOÁN HÓA ĐƠN
  // =======================================================
  const calculateSummary = () => {
    // 1. Tính tổng tiền hàng (dùng getTotal() từ hook thật)
    const subtotal = getTotal();

    // 2. Phí vận chuyển (Giả lập, CSDL của bạn chưa có logic này)
    const shipping = subtotal > 500000 ? 0 : 30000; // Miễn phí ship > 500k

    // 3. Giảm giá (từ coupon)
    const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;

    // 4. Tổng cộng
    const total = Math.max(0, subtotal + shipping - discount);

    return { subtotal, shipping, discount, total };
  };

  const { subtotal, shipping, discount, total } = calculateSummary();

  // =======================================================
  // XỬ LÝ ĐẶT HÀNG
  // =======================================================
  const handlePlaceOrder = async () => {
    // 1. Validation
    if (!formData.fullName.trim() || !formData.phoneNumber.trim()) {
      toast.error("Vui lòng nhập đầy đủ Họ tên và Số điện thoại.");
      return;
    }
    // (Kiểm tra SĐT chuẩn 10 số - đã có trong handleProfileUpdate)
    const vietnamPhoneRegex = /^0\d{9}$/;
    if (!vietnamPhoneRegex.test(formData.phoneNumber)) {
      toast.error("Số điện thoại không hợp lệ (cần 10 số, bắt đầu bằng 0).");
      return;
    }
    if (!formData.address.trim() || !currentLatLonRef.current.lat) {
      toast.error("Vui lòng chọn địa chỉ giao hàng trên bản đồ hoặc từ danh sách.");
      return;
    }

    setIsLoading(true);
    console.log(cartItems);
    // 2. Tạo Payload (Khớp với CSDL Bảng `orders`)
    const orderPayload = {
      userId: null, // Backend sẽ tự lấy từ token
      latitude: selectedLatLon.lat,
      longitude: selectedLatLon.lon,
      address: formData.address,

      // (Thông tin liên hệ - API nên lưu vào order)
      customerName: formData.fullName,
      customerPhone: formData.phoneNumber,

      subtotalPrice: subtotal,
      shippingFee: shipping,
      discountAmount: discount,
      totalPrice: total,

      paymentMethod: paymentMethod, // "COD" hoặc "ONLINE"
      paymentStatus: paymentMethod === 'COD' ? 'UNPAID' : 'PENDING', // Trạng thái chờ

      orderStatus: 'PENDING', // Luôn là PENDING khi mới tạo

      // Backend sẽ cần tự map cartItems sang order_items
      items: cartItems.map(item => ({
        // SỬA: Đảm bảo gửi variantId
        productId: item.productId,
        dimensions: item.dimensions,// (Bạn phải đảm bảo cart lưu 'variantId')
        quantity: item.quantity,
        priceAtPurchase: item.price // (Giá này đã bao gồm KM tự động)
      })),

      // Gửi mã coupon (nếu có)
      promotionCode: appliedCoupon ? appliedCoupon.code : null
    };

    try {
      // TODO: Đảm bảo API này (POST /api/v1/orders) tồn tại
      const response = await axios.post(`${API_BASE_URL}/api/v1/orders`, orderPayload, {
        headers: createAuthHeaders()
      });

      // Nếu thanh toán ONLINE (ví dụ: Sepay/VNPAY)
      if (paymentMethod === 'ONLINE') {
        console.log(response.data)
        // Backend trả về { paymentUrl: "...", formParams: {...} }
        // Backend trả về { paymentUrl: "https://sandbox.vnpayment.vn/..." }
        if (response.data && response.data.paymentUrl) {
          localStorage.removeItem('cart');
          // Chuyển hướng sang trang VNPAY
          window.location.href = response.data.paymentUrl;
        } else {
          throw new Error("Không nhận được URL thanh toán từ máy chủ.");
        }
      } else {
        // Nếu là COD
        toast.success("Đặt hàng thành công!");
        localStorage.removeItem('cart'); // Xóa giỏ hàng
        navigate('/order-success'); // Chuyển đến trang Cảm ơn
      }

    } catch (error) {
      console.error("Lỗi khi đặt hàng:", error);
      toast.error(error.response?.data || "Đặt hàng thất bại, vui lòng thử lại.");
      setIsLoading(false);
    }
  };


  // --- CSS (Dài, nhúng vào) ---
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
    
    /* ================================== */
    /* MỚI: CSS CHO TRANG CHECKOUT */
    /* ================================== */
    .checkout-page {
      max-width: 1200px;
      margin: 40px auto;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }
    .checkout-header {
      font-size: 2.5rem;
      font-weight: 700;
      color: #333;
      border-bottom: 2px solid #f0f0f0;
      padding-bottom: 15px;
      margin-bottom: 25px;
    }
    
    /* Layout 2 cột */
    .checkout-container {
      display: grid;
      grid-template-columns: 1fr; /* 1 cột trên mobile */
      gap: 30px;
    }
    /* 2 cột trên desktop (60% 40%) */
    @media (min-width: 992px) {
      .checkout-container {
        grid-template-columns: 3fr 2fr;
      }
    }

    .checkout-form h3, .checkout-summary h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #444;
      margin-bottom: 20px;
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
    }
    
    /* CSS cho Form (Cột trái) */
    .checkout-form-section {
      background: #fafafa;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 25px;
    }
    .form-group {
      margin-bottom: 15px;
    }
    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: #555;
      font-size: 0.9rem;
    }
    .form-group input[type="text"],
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #ccc;
      border-radius: 6px;
      font-size: 1rem;
      box-sizing: border-box; /* Quan trọng */
    }
    .form-group textarea {
      min-height: 80px;
      resize: vertical;
    }
    
    /* CSS cho TomTom (Giống UserProfile) */
    .api-key-error {
        padding: 15px;
        background-color: #ffebee;
        color: #c62828;
        border: 1px solid #c62828;
        border-radius: 8px;
        font-weight: 500;
        text-align: center;
    }
    .map-container {
      height: 300px; /* Thấp hơn UserProfile */
      width: 100%;
      border-radius: 8px;
      overflow: hidden;
      margin-top: 15px;
    }
    .address-search-wrapper { position: relative; }
    .search-results-container {
      position: absolute;
      width: 100%;
      background: #fff;
      border: 1px solid #ddd;
      border-top: none;
      border-radius: 0 0 8px 8px;
      box-shadow: 0 5px 10px rgba(0,0,0,0.1);
      z-index: 1000;
      max-height: 250px;
      overflow-y: auto;
    }
    .search-result-item {
      padding: 12px 15px;
      cursor: pointer;
      font-size: 0.95rem;
      border-bottom: 1px solid #f0f0f0;
    }
    .search-result-item:hover { background-color: #f5f5f5; }
    .custom-marker {
        width: 20px;
        height: 20px;
        background-color: #E74C3C; /* Màu đỏ */
        border: 2px solid #FFFFFF;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        cursor: grab;
    }

    /* CSS cho Phương thức thanh toán */
    .payment-options {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    .payment-option {
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 15px;
      display: flex;
      align-items: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .payment-option input[type="radio"] {
      margin-right: 15px;
      transform: scale(1.2);
    }
    .payment-option label {
      font-weight: 600;
      color: #333;
      display: flex;
      align-items: center;
      width: 100%;
      margin: 0;
    }
    .payment-option.selected {
      border-color: #007bff;
      background-color: #f0f8ff;
    }
    
    /* CSS cho Tóm tắt (Cột phải) */
    .checkout-summary {
      position: sticky; /* Bám theo khi cuộn */
      top: 20px;
      background: #fafafa;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 25px;
    }
    
    /* Danh sách hàng */
    .order-item-list {
      max-height: 300px;
      overflow-y: auto;
      padding-right: 10px;
      margin-bottom: 15px;
    }
    .order-item {
      display: flex;
      gap: 15px;
      padding-bottom: 15px;
      margin-bottom: 15px;
      border-bottom: 1px solid #eee;
    }
    .order-item img {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 6px;
    }
    .order-item-details {
      flex-grow: 1;
    }
    .order-item-details .name {
      font-weight: 600;
      color: #333;
    }
    .order-item-details .variant {
      font-size: 0.9rem;
      color: #777;
    }
    .order-item-price {
      font-weight: 600;
      color: #007bff;
    }

    /* Coupon */
    .coupon-form {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }
    .coupon-form input {
      flex-grow: 1;
      padding: 10px 12px;
      border: 1px solid #ccc;
      border-radius: 6px;
      font-size: 1rem;
    }
    .btn-apply-coupon {
      padding: 0 20px;
      border: 1px solid #007bff;
      border-radius: 6px;
      background-color: #e0f0ff;
      color: #007bff;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
    }
    .btn-apply-coupon:disabled {
      background-color: #eee;
      color: #aaa;
    }
    
    /* Tính toán Tổng tiền */
    .summary-calculation {
      display: flex;
      flex-direction: column;
      gap: 10px;
      border-top: 1px solid #eee;
      padding-top: 15px;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      font-size: 1rem;
    }
    .summary-row.discount {
      color: #28a745; /* Xanh lá */
    }
    .summary-row.total {
      font-size: 1.3rem;
      font-weight: bold;
      color: #333;
      border-top: 2px solid #ddd;
      padding-top: 10px;
      margin-top: 5px;
    }
    
    /* Nút Đặt hàng */
    .btn-place-order {
      width: 100%;
      padding: 14px;
      border: none;
      border-radius: 8px;
      background-color: #dc3545; /* Màu đỏ */
      color: white;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      margin-top: 20px;
    }
    .btn-place-order:disabled {
      background-color: #aaa;
    }
  `;
  // ==================================
  // KẾT THÚC CSS
  // ==================================

  return (
    <>
      <StyleInjector styles={allStyles} />
      <LoadingSpinner isLoading={isLoading} />

      <div className="checkout-page">
        <div style={{ display: 'flex', alignItems: 'center', borderBottom: '2px solid #f0f0f0', paddingBottom: '15px', marginBottom: '25px' }}>
          <button
            onClick={() => navigate('/cart')}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#333',
              marginRight: '15px',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '50%',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#f0f0f0'}
            onMouseOut={(e) => e.currentTarget.style.background = 'none'}
            title="Quay lại giỏ hàng"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <h1 className="checkout-header" style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: 0 }}>Thanh Toán</h1>
        </div>

        <div className="checkout-container">
          <div className="checkout-form">

            {/* --- 1. Thông tin giao hàng --- */}
            <div className="checkout-form-section">
              <h3>Thông tin giao hàng</h3>
              <div className="form-group">
                <label htmlFor="fullName">Email (*)</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={email}
                  placeholder=""
                  disabled="false"
                  style={{
                    // Nếu lock thì màu xám, nếu không thì màu trắng
                    backgroundColor: '#e9ecef'
                  }}
                />
              </div>
              {/* Họ tên */}
              <div className="form-group">
                <label htmlFor="fullName">Họ và Tên (*)</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleFormChange}
                  placeholder="Họ và tên"
                />
              </div>

              {/* SĐT */}
              <div className="form-group">
                <label htmlFor="phoneNumber">Số điện thoại (*)</label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleFormChange}
                  placeholder="0909..."
                />
              </div>

              {/* Chọn địa chỉ đã lưu */}
              {savedAddresses.length > 0 && (
                <div className="form-group">
                  <label htmlFor="savedAddress">Chọn địa chỉ đã lưu:</label>
                  <select
                    id="savedAddress"
                    value={selectedAddressId || ''}
                    onChange={(e) => {
                      const id = e.target.value ? Number(e.target.value) : null;
                      handleSelectSavedAddress(savedAddresses.find(a => a.id === id) || null);
                    }}
                  >
                    <option value="">-- Nhập địa chỉ mới bên dưới --</option>
                    {savedAddresses.map(addr => (
                      <option key={addr.id} value={addr.id}>
                        {addr.addressName} ({addr.address})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Nhập địa chỉ mới (Fuzzy Search) */}
              <div className="form-group address-search-wrapper">
                <label htmlFor="address">Địa chỉ chi tiết (*)</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleAddressInputChange}
                  placeholder="Nhập địa chỉ của bạn để tìm kiếm..."
                  autoComplete="off"
                />
                {searchResults.length > 0 && (
                  <div className="search-results-container">
                    {searchResults.map(result => (
                      <div
                        key={result.id}
                        className="search-result-item"
                        onClick={() => handleSearchResultClick(result)}
                      >
                        {result?.address?.freeformAddress || 'Địa chỉ không xác định'}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bản đồ TomTom */}
              <label>Ghim trên bản đồ:</label>
              {!TOMTOM_API_KEY && <div className="api-key-error">Lỗi API Key</div>}
              <div
                id="tomtom-map"
                ref={mapContainerRef}
                className="map-container"
              >
                {/* Bản đồ sẽ được tải vào đây */}
              </div>
            </div>

            {/* --- 2. Phương thức thanh toán --- */}
            <div className="checkout-form-section">
              <h3>Phương thức thanh toán</h3>
              <div className="payment-options">
                {/* Tiền mặt (COD) */}
                <div
                  className={`payment-option ${paymentMethod === 'COD' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('COD')}
                >
                  <input
                    type="radio"
                    id="cod"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                  />
                  <label htmlFor="cod">
                    <FontAwesomeIcon icon={faMoneyBillWave} style={{ color: '#28a745' }} />
                    Thanh toán khi nhận hàng (COD)
                  </label>
                </div>

                {/* Chuyển khoản (ONLINE) */}
                <div
                  className={`payment-option ${paymentMethod === 'ONLINE' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('ONLINE')}
                >
                  <input
                    type="radio"
                    id="online"
                    name="paymentMethod"
                    value="ONLINE"
                    checked={paymentMethod === 'ONLINE'}
                    onChange={() => setPaymentMethod('ONLINE')}
                  />
                  <label htmlFor="online">
                    <FontAwesomeIcon icon={faCreditCard} style={{ color: '#007bff' }} />
                    Chuyển khoản (VNPAY/Momo/Sepay)
                  </label>
                </div>
              </div>
            </div>

          </div>

          {/* ============================================ */}
          {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG */}
          {/* ============================================ */}
          <div className="checkout-summary">
            <h3>Đơn hàng của bạn ({cartItems.length} sản phẩm)</h3>

            {/* Danh sách sản phẩm trong giỏ hàng */}
            <div className="order-item-list">
              {cartItems.length === 0 ? (
                <p>Giỏ hàng của bạn đang trống.</p>
              ) : (
                cartItems.map(item => (
                  <div className="order-item" key={item.cartItemId || item.variantId}>
                    <img src={item.thumbnail} alt={item.productName} />
                    <div className="order-item-details">
                      <div className="name">{item.productName}</div>
                      <div className="variant">
                        {item.dimensions} (SL: {item.quantity})
                      </div>
                    </div>
                    <div className="order-item-price">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Mã giảm giá */}
            <h3>Mã giảm giá</h3>
            <div className="coupon-form">
              <input
                type="text"
                placeholder="Nhập mã giảm giá..."
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                disabled={!!appliedCoupon} // Khóa nếu đã áp dụng
              />
              <button
                className="btn-apply-coupon"
                onClick={handleApplyCoupon}
                disabled={isCheckingCoupon || !!appliedCoupon}
              >
                {isCheckingCoupon ? 'Đang...' : (appliedCoupon ? 'Đã áp dụng' : 'Áp dụng')}
              </button>
            </div>

            {/* Tính toán */}
            <div className="summary-calculation">
              <div className="summary-row">
                <span>Tạm tính:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="summary-row">
                <span>Phí vận chuyển:</span>
                <span>{shipping === 0 ? 'Miễn phí' : formatCurrency(shipping)}</span>
              </div>
              {appliedCoupon && (
                <div className="summary-row discount">
                  <span>Giảm giá ({appliedCoupon.code}):</span>
                  <span>- {formatCurrency(discount)}</span>
                </div>
              )}
              <div className="summary-row total">
                <span>Tổng cộng:</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <button
              className="btn-place-order"
              onClick={handlePlaceOrder}
              disabled={isLoading || cartItems.length === 0}
            >
              {isLoading ? 'Đang xử lý...' : 'Đặt Hàng'}
            </button>

          </div>
        </div >
      </div >
    </>
  );
}
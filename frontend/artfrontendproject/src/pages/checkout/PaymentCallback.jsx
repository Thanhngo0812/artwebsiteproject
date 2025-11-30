import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, XCircle, Loader2, Home } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner/LoadingSpinner';
// 1. Import Toastify (Bỏ import CSS file trực tiếp để tránh lỗi build)
import { toast, ToastContainer } from 'react-toastify';

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [status, setStatus] = useState('processing'); // processing | success | failed | error
  const [message, setMessage] = useState('Đang xử lý kết quả thanh toán...');
  const [countdown, setCountdown] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const API_BASE_URL = 'https://deployforstudy-1.onrender.com/api';

  // 2. Inject CSS cho Toastify thủ công thông qua CDN
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/react-toastify@9.1.3/dist/ReactToastify.min.css';
    document.head.appendChild(link);

    return () => {
      // Dọn dẹp khi component unmount (nếu cần)
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const processPayment = async () => {
      try {
        const responseCode = searchParams.get('vnp_ResponseCode');
        const orderId = searchParams.get('vnp_TxnRef'); 

        if (!orderId || !responseCode) {
          setStatus('error');
          setMessage('Thiếu thông tin giao dịch. Không thể xác thực.');
          toast.error('Lỗi: Thiếu thông tin giao dịch!');
          return;
        }

        if (responseCode === '00') {
          // --- THÀNH CÔNG ---
          await axios.put(`${API_BASE_URL}/orders/${orderId}/confirm`);
          
          setStatus('success');
          setMessage('Thanh toán thành công! Đơn hàng của bạn đã được xác nhận.');
          
          // Hiện Toast Thành công
          toast.success('🎉 Thanh toán thành công!', {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
                navigate('/'); 


        } else {
          // --- THẤT BẠI ---
          await axios.put(`${API_BASE_URL}/orders/${orderId}/cancel`);
          
          setStatus('failed');
          setMessage('Giao dịch thất bại hoặc đã bị hủy.');
          
          // Hiện Toast Thất bại
          toast.error('❌ Thanh toán thất bại! Đơn hàng đã bị hủy.', {
            position: "top-right",
            autoClose: 4000,
          });
                navigate('/'); 

        }

      } catch (error) {
        console.error("Lỗi xử lý thanh toán:", error);
        setStatus('error');
        const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật đơn hàng.';
        setMessage(errorMsg);
        
          toast.error('❌ Thanh toán thất bại! Đơn hàng đã bị hủy.', {
            position: "top-right",
            autoClose: 4000,
          });
                navigate('/'); 

      }
    };

    // Chỉ chạy 1 lần khi mount
    if (status === 'processing') {
        processPayment();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  // Logic đếm ngược
  useEffect(() => {
    if (status === 'processing') return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    if (countdown === 0) {
      navigate('/'); 
    }

    return () => clearInterval(timer);
  }, [status, countdown, navigate]);

  return (
          <LoadingSpinner isLoading={isLoading} />
  );
};

export default PaymentCallback;
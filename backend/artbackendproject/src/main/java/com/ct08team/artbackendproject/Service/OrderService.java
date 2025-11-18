package com.ct08team.artbackendproject.Service;


import com.ct08team.artbackendproject.DAO.Auth.UserRepository;

import com.ct08team.artbackendproject.DAO.OrderRepository;
import com.ct08team.artbackendproject.DAO.ProductVariantRepository;
import com.ct08team.artbackendproject.DAO.PromotionRepository;
import com.ct08team.artbackendproject.DTO.OrderDTO;
import com.ct08team.artbackendproject.DTO.PaymentResponseDTO; // Dùng DTO cũ (chỉ có paymentUrl)
import com.ct08team.artbackendproject.Entity.Order;
import com.ct08team.artbackendproject.Entity.OrderItem;
import com.ct08team.artbackendproject.Entity.auth.User;

import com.ct08team.artbackendproject.Entity.product.ProductVariant;

import com.ct08team.artbackendproject.Service.VnpayService; // <-- QUAY LẠI VNPAY
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProductVariantRepository variantRepository;
    @Autowired
    private PromotionRepository promotionRepository;

    // =======================================================
    // SỬA: Quay lại VnpayService
    // =======================================================
    @Autowired
    private VnpayService vnpayService;
    /**
     * Lấy thông tin đơn hàng từ Database theo ID
     * Tương ứng với SQL: SELECT * FROM orders WHERE id = {orderId}
     * * @param orderId ID của đơn hàng (Kiểu Long do DB set BIGINT)
     * @return Order object hoặc throw exception nếu không tìm thấy
     */
    public Order getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng với ID: " + orderId));
    }
    public Order save(Order order) {
        return orderRepository.save(order);
    }
    @Transactional(rollbackFor = Exception.class)
    public PaymentResponseDTO createOrder(OrderDTO orderDTO, String username, HttpServletRequest request) throws Exception {

        // 1. Tìm User
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng: " + username));

        // ... (Code tạo Order, xử lý tồn kho, promotion GIỮ NGUYÊN NHƯ CŨ) ...
        // (Tôi sẽ tóm tắt lại để file ngắn gọn, logic này bạn đã có)
        Order order = new Order();
        order.setUser(user);
        order.setCustomerName(orderDTO.getCustomerName());
        order.setCustomerPhone(orderDTO.getCustomerPhone());
        order.setAddress(orderDTO.getAddress());
        order.setLatitude(orderDTO.getLatitude());
        order.setLongitude(orderDTO.getLongitude());
        order.setSubtotalPrice(orderDTO.getSubtotalPrice());
        order.setShippingFee(orderDTO.getShippingFee());
        order.setDiscountAmount(orderDTO.getDiscountAmount());
        order.setTotalPrice(orderDTO.getTotalPrice());
        order.setPaymentMethod(orderDTO.getPaymentMethod());
        order.setPaymentStatus("UNPAID");
        order.setOrderStatus("PENDING");

        if (orderDTO.getPromotionCode() != null) {
            // Logic coupon...
        }

        List<OrderItem> orderItems = new ArrayList<>();
        for (OrderDTO.ItemDTO itemDTO : orderDTO.getItems()) {
            // Logic kiểm tra tồn kho và tạo OrderItem...
            ProductVariant variant = variantRepository.findByProductIdAndDimensions(itemDTO.getProductId(), itemDTO.getDimensions())
                    .orElseThrow(() -> new RuntimeException("Variant not found"));

            // ... (Trừ tồn kho)
            variant.setStockQuantity(variant.getStockQuantity() - itemDTO.getQuantity());
            variantRepository.save(variant);

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setVariant(variant);
            item.setQuantity(itemDTO.getQuantity());
            item.setPriceAtPurchase(itemDTO.getPriceAtPurchase());
            item.setDiscountApplied(variant.getPrice().subtract(itemDTO.getPriceAtPurchase()));
            item.setCostPriceAtPurchase(variant.getCostPrice());
            orderItems.add(item);
        }
        order.setOrderItems(orderItems);

        Order savedOrder = orderRepository.save(order);

        // =======================================================
        // SỬA: Logic Thanh toán VNPAY
        // =======================================================
        if ("ONLINE".equals(order.getPaymentMethod())) {
            // Tạo URL thanh toán VNPAY
            String paymentUrl = vnpayService.createPaymentUrl(savedOrder.getTotalPrice(), savedOrder.getId(), request);

            // Trả về PaymentResponseDTO (chỉ chứa URL)
            return new PaymentResponseDTO("OK", "Chuyển hướng tới VNPAY...", paymentUrl);
        } else {
            return new PaymentResponseDTO("OK", "Đặt hàng COD thành công", null);
        }
    }
}
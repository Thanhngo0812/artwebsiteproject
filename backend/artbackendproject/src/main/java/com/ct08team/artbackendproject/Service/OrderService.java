package com.ct08team.artbackendproject.Service;


import com.ct08team.artbackendproject.DAO.Auth.UserRepository;

import com.ct08team.artbackendproject.DAO.OrderRepository;
import com.ct08team.artbackendproject.DAO.ProductVariantRepository;
import com.ct08team.artbackendproject.DAO.PromotionRepository;
import com.ct08team.artbackendproject.DTO.OrderDTO;
import com.ct08team.artbackendproject.DTO.OrderHistoryDTO;
import com.ct08team.artbackendproject.DTO.PaymentResponseDTO; // Dùng DTO cũ (chỉ có paymentUrl)
import com.ct08team.artbackendproject.Entity.Order;
import com.ct08team.artbackendproject.Entity.OrderItem;
import com.ct08team.artbackendproject.Entity.auth.User;

import com.ct08team.artbackendproject.Entity.product.ProductVariant;

import com.ct08team.artbackendproject.Entity.promotion.OrderPromotion;
import com.ct08team.artbackendproject.Entity.promotion.Promotion;
import com.ct08team.artbackendproject.Service.VnpayService; // <-- QUAY LẠI VNPAY
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.sql.Date;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
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

        // 3. XỬ LÝ LOGIC COUPON (Lưu vào bảng order_promotions)
        if (orderDTO.getPromotionCode() != null && !orderDTO.getPromotionCode().isEmpty()) {
            // a. Tìm khuyến mãi trong DB
            Promotion promotion = promotionRepository.findByCode(orderDTO.getPromotionCode())
                    .orElseThrow(() -> new RuntimeException("Mã khuyến mãi không tồn tại!"));

            // b. Validate lại ở Backend (Quan trọng để bảo mật)
            LocalDateTime now = LocalDateTime.now();

            if (!promotion.isActive() || now.isBefore(promotion.getStartDate()) || now.isAfter(promotion.getEndDate())) {
                throw new RuntimeException("Mã khuyến mãi đã hết hạn hoặc chưa kích hoạt.");
            }
            if (promotion.getUsageLimit() != null && promotion.getUsageCount() >= promotion.getUsageLimit()) {
                throw new RuntimeException("Mã khuyến mãi đã hết lượt sử dụng.");
            }
            // (Có thể check thêm minOrderValue nếu cần)

            // c. Tạo liên kết Order - Promotion
            // Dù Frontend đã tính tiền, ta lấy số tiền đó lưu vào để đối soát
            OrderPromotion orderPromotion = new OrderPromotion();
            orderPromotion.setOrder(order); // Liên kết với đơn hàng hiện tại
            orderPromotion.setPromotion(promotion);
            orderPromotion.setDiscountApplied(orderDTO.getDiscountAmount());

            // Thêm vào list của Order để Cascade lưu xuống DB
            order.setOrderPromotion(orderPromotion);

            // d. Tăng số lượt sử dụng của mã
            promotion.setUsageCount(promotion.getUsageCount() + 1);
            promotionRepository.save(promotion);
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
    // API: Lấy danh sách đơn cho Admin
    @Transactional(readOnly = true)
    public Page<OrderHistoryDTO> getOrdersForAdmin(String status, String keyword, LocalDate fromDate, LocalDate toDate, Pageable pageable) {
        Instant start = (fromDate != null) ? fromDate.atStartOfDay(ZoneId.systemDefault()).toInstant() : null;
        Instant end = (toDate != null) ? toDate.atTime(23, 59, 59).atZone(ZoneId.systemDefault()).toInstant() : null;

        Page<Order> orders = orderRepository.searchOrdersAdmin(status, keyword, start, end, pageable);
        return orders.map(OrderHistoryDTO::new);
    }

    // API: Cập nhật trạng thái đơn hàng
    @Transactional
    public void updateOrderStatus(Long orderId, String newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng ID: " + orderId));

        // Logic chuyển trạng thái
        if ("CANCELLED".equals(newStatus)) {
            // Nếu Admin hủy -> Hoàn kho
            if (!"CANCELLED".equals(order.getOrderStatus())) {
                for (OrderItem item : order.getOrderItems()) {
                    ProductVariant variant = item.getVariant();
                    if (variant != null) {
                        variant.setStockQuantity(variant.getStockQuantity() + item.getQuantity());
                        variantRepository.save(variant);
                    }
                }
            }
            order.setPaymentStatus("FAILED");
        } else if ("PAID".equals(newStatus)) {
            order.setPaymentStatus("SUCCESSFUL");
        } else if ("DELIVERED".equals(newStatus)) {
            if ("COD".equals(order.getPaymentMethod())) {
                order.setPaymentStatus("SUCCESSFUL");
            }
        }

        order.setOrderStatus(newStatus);
        orderRepository.save(order);
    }
    @Transactional(readOnly = true)
    public Page<OrderHistoryDTO> getUserOrders(String username, LocalDate fromDate, LocalDate toDate, Pageable pageable) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Instant start = (fromDate != null) ? fromDate.atStartOfDay(ZoneId.systemDefault()).toInstant() : null;
        Instant end = (toDate != null) ? toDate.atTime(23, 59, 59).atZone(ZoneId.systemDefault()).toInstant() : null;

        // 1. Lấy Page<Order> từ Repository
        Page<Order> orderPage = orderRepository.findByUserAndDateRange(user, start, end, pageable);

        // 2. Chuyển đổi sang Page<OrderHistoryDTO>
        return orderPage.map(OrderHistoryDTO::new);
    }

    @Transactional(rollbackFor = Exception.class)
    public void cancelOrderByUser(Long orderId, String username) {
        // 1. Tìm đơn hàng
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng với ID: " + orderId));

        // 2. Kiểm tra quyền sở hữu (Bảo mật)
        // Chỉ cho phép hủy nếu đơn hàng thuộc về user đang đăng nhập
        if (!order.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Bạn không có quyền hủy đơn hàng này.");
        }

        // 3. Kiểm tra trạng thái
        // Chỉ được hủy khi còn PENDING
        if (!"PENDING".equals(order.getOrderStatus())) {
            // Thông báo lỗi tùy chỉnh như bạn yêu cầu
            throw new RuntimeException("Đơn hàng đã được thanh toán hoặc đang xử lý, không thể hủy. Vui lòng liên hệ 0909246319 để được hỗ trợ.");
        }

        // 4. Hoàn trả tồn kho (Rất quan trọng!)
        // Khi hủy đơn, phải cộng lại số lượng vào kho
        for (OrderItem item : order.getOrderItems()) {
            ProductVariant variant = item.getVariant();
            variant.setStockQuantity(variant.getStockQuantity() + item.getQuantity());
            variantRepository.save(variant);
        }

        // 5. Cập nhật trạng thái
        order.setOrderStatus("CANCELLED");
        order.setPaymentStatus("FAILED"); // Hoặc "CANCELLED" tùy logic của bạn

        // (Nếu có coupon, có thể cân nhắc hoàn lại lượt sử dụng, nhưng thường thì không cần)

        orderRepository.save(order);
    }
}
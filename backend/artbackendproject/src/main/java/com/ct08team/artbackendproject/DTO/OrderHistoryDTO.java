package com.ct08team.artbackendproject.DTO;

import com.ct08team.artbackendproject.Entity.Order;
import com.ct08team.artbackendproject.Entity.OrderItem;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class OrderHistoryDTO {
    private Long id;
    private Instant createdAt;
    private String orderStatus;
    private String paymentStatus;
    private String paymentMethod;
    private BigDecimal totalPrice;
    private BigDecimal subtotalPrice;
    private BigDecimal shippingFee;
    private BigDecimal discountAmount;

    // Thông tin người nhận
    private String customerName;
    private String customerPhone;
    private String address;
    private BigDecimal latitude;
    private BigDecimal longitude;

    // Danh sách sản phẩm
    private List<OrderItemDTO> orderItems;

    public OrderHistoryDTO(Order order) {
        this.id = order.getId();
        this.createdAt = order.getCreatedAt();
        this.orderStatus = order.getOrderStatus();
        this.paymentStatus = order.getPaymentStatus();
        this.paymentMethod = order.getPaymentMethod();
        this.totalPrice = order.getTotalPrice();
        this.subtotalPrice = order.getSubtotalPrice();
        this.shippingFee = order.getShippingFee();
        this.discountAmount = order.getDiscountAmount();

        this.customerName = order.getCustomerName();
        this.customerPhone = order.getCustomerPhone();
        this.address = order.getAddress();
        this.latitude = order.getLatitude();
        this.longitude = order.getLongitude();

        // Map OrderItems
        if (order.getOrderItems() != null) {
            this.orderItems = order.getOrderItems().stream()
                    .map(OrderItemDTO::new)
                    .collect(Collectors.toList());
        }
    }

    @Data
    public static class OrderItemDTO {
        private Long id;
        private String productName;
        private String thumbnail;
        private String dimensions;
        private Integer quantity;
        private BigDecimal priceAtPurchase; // <-- Giá lúc mua (Cái bạn đang cần)

        public OrderItemDTO(OrderItem item) {
            this.id = item.getId();
            this.quantity = item.getQuantity();
            this.priceAtPurchase = item.getPriceAtPurchase(); // Lấy giá từ Entity OrderItem

            if (item.getVariant() != null) {
                this.dimensions = item.getVariant().getDimensions();
                if (item.getVariant().getProduct() != null) {
                    this.productName = item.getVariant().getProduct().getProductName();
                    this.thumbnail = item.getVariant().getProduct().getThumbnail();
                }
            }
        }
    }
}
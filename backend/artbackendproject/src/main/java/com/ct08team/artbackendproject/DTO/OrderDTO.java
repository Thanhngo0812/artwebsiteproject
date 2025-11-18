package com.ct08team.artbackendproject.DTO;


import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

/**
 * DTO này nhận payload từ React khi Đặt Hàng
 * (Khớp với 'orderPayload' trong CheckoutPage.jsx)
 */
@Data
public class OrderDTO {

    // Thông tin người nhận
    private String customerName;
    private String customerPhone;
    private String address;
    private BigDecimal latitude;
    private BigDecimal longitude;

    // Thông tin thanh toán
    private BigDecimal subtotalPrice;
    private BigDecimal shippingFee;
    private BigDecimal discountAmount;
    private BigDecimal totalPrice;
    private String paymentMethod; // "COD" hoặc "ONLINE"
    private String paymentStatus;
    private String orderStatus;

    // Thông tin đơn hàng
    private String promotionCode; // Mã coupon (nếu có)
    private List<ItemDTO> items;

    /**
     * DTO lồng nhau cho các sản phẩm trong giỏ hàng
     */
    @Data
    public static class ItemDTO {
        private Long productId;
        private String dimensions;
        private Integer quantity;
        private BigDecimal priceAtPurchase;
    }
}
package com.ct08team.artbackendproject.DTO.Promotion;

import java.math.BigDecimal;

public class PromotionDTO {

    /**
     * DTO này nhận Request Body từ React
     * (POST /api/v1/promotions/apply)
     * SỬA: Thêm subtotal
     */
    public static class ApplyRequest {
        private String code;
        private BigDecimal subtotal; // Tạm tính (từ giỏ hàng)

        // Getters/Setters
        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }
        public BigDecimal getSubtotal() { return subtotal; }
        public void setSubtotal(BigDecimal s) { this.subtotal = s; }
    }

    /**
     * DTO này trả về cho React sau khi áp dụng thành công
     */
    public static class ApplyResponse {
        private String code;
        private BigDecimal discountAmount;
        private String message;

        public ApplyResponse(String code, BigDecimal discountAmount, String message) {
            this.code = code;
            this.discountAmount = discountAmount;
            this.message = message;
        }

        // Getters/Setters
        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }
        public BigDecimal getDiscountAmount() { return discountAmount; }
        public void setDiscountAmount(BigDecimal d) { this.discountAmount = d; }
        public String getMessage() { return message; }
        public void setMessage(String m) { this.message = m; }
    }
}
package com.ct08team.artbackendproject.Service.Promotion;



import com.ct08team.artbackendproject.DAO.PromotionRepository;
import com.ct08team.artbackendproject.DTO.Promotion.PromotionDTO;
import com.ct08team.artbackendproject.Entity.promotion.Promotion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.ZoneId;
import java.util.Optional;

@Service
public class PromotionService {

    @Autowired
    private PromotionRepository promotionRepository;

    /**
     * Xử lý logic áp dụng mã coupon
     * (React: handleApplyCoupon)
     */
    @Transactional(readOnly = true)
    public PromotionDTO.ApplyResponse applyCoupon(PromotionDTO.ApplyRequest request) {

        String code = request.getCode().toUpperCase();
        BigDecimal subtotal = request.getSubtotal(); // Lấy Tạm tính

        if (subtotal == null) {
            throw new RuntimeException("Lỗi: Không có Tạm tính (subtotal).");
        }

        // 1. Tìm coupon trong CSDL bằng 'code'
        Optional<Promotion> promoOpt = promotionRepository.findByCode(code);

        if (!promoOpt.isPresent()) {
            throw new RuntimeException("Mã giảm giá không tồn tại.");
        }

        Promotion promo = promoOpt.get();
        Instant now = Instant.now();

        // 2. Kiểm tra các điều kiện
        if (!promo.isActive()) {
            throw new RuntimeException("Mã này đã bị vô hiệu hóa.");
        }
        if (now.isBefore(promo.getStartDate().atZone(ZoneId.systemDefault()).toInstant())) {
            throw new RuntimeException("Mã này chưa đến ngày áp dụng.");
        }
        if (now.isAfter(promo.getEndDate().atZone(ZoneId.systemDefault()).toInstant())) {
            throw new RuntimeException("Mã này đã hết hạn.");
        }
        if (promo.getUsageLimit() != null && promo.getUsageCount() >= promo.getUsageLimit()) {
            throw new RuntimeException("Mã này đã hết lượt sử dụng.");
        }
        // SỬA: Kiểm tra min_order_value (dùng Tạm tính)
        if (promo.getMinOrderValue() != null && subtotal.compareTo(promo.getMinOrderValue()) < 0) {
            throw new RuntimeException("Đơn hàng chưa đủ điều kiện (tối thiểu " + formatCurrency(promo.getMinOrderValue()) + ")");
        }

        // 3. Tính toán số tiền giảm
        BigDecimal discountAmount;
        String message;
        if ("FIXED_AMOUNT".equals(promo.getType().toString())) {
            discountAmount = promo.getValue();
            message = "Đã áp dụng giảm giá " + formatCurrency(discountAmount);
        } else if ("PERCENTAGE".equals(promo.getType().toString())) {
            // SỬA: Dùng Tạm tính (subtotal) thật
            discountAmount = subtotal.multiply(promo.getValue().divide(new BigDecimal("100")));

            // Kiểm tra max_discount_value
            if (promo.getMaxDiscountValue() != null && discountAmount.compareTo(promo.getMaxDiscountValue()) > 0) {
                discountAmount = promo.getMaxDiscountValue();
            }
            message = "Đã áp dụng giảm giá " + promo.getValue() + "%";
        } else {
            throw new RuntimeException("Loại khuyến mãi không xác định.");
        }

        // 4. Trả về response cho React
        return new PromotionDTO.ApplyResponse(
                promo.getCode(),
                discountAmount,
                message
        );
    }

    // (Hàm format tiền tệ giả lập)
    private String formatCurrency(BigDecimal value) {
        // (Bạn nên có một hàm helper chung cho việc này)
        return value.toString() + " ₫";
    }
}
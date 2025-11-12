// Giả sử file này ở trong package Service.Promotion
package com.ct08team.artbackendproject.Service.Promotion;

import com.ct08team.artbackendproject.DAO.PromotionRepository;
import com.ct08team.artbackendproject.Entity.product.Category;
import com.ct08team.artbackendproject.Entity.product.Product;
import com.ct08team.artbackendproject.Entity.promotion.Promotion; // Giả sử Entity
import com.ct08team.artbackendproject.Entity.promotion.PromotionType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class PromotionCalculationService {

    @Autowired
    private PromotionRepository promotionRepository;

    /**
     * Tính toán giá khuyến mãi tốt nhất (thấp nhất) cho một sản phẩm.
     * @param product Sản phẩm cần kiểm tra
     * @return Optional<BigDecimal> chứa giá sau khuyến mãi,
     * hoặc Optional.empty() nếu không có khuyến mãi nào.
     */
    @Transactional(readOnly = true)
    public Optional<BigDecimal> calculateBestPromotionPrice(Product product) {
        BigDecimal originalPrice = product.getMinPrice();
        // Không tính nếu sản phẩm không có giá
        if (originalPrice == null || originalPrice.compareTo(BigDecimal.ZERO) <= 0) {
            return Optional.empty();
        }

        // 1. Lấy tất cả khuyến mãi tự động đang chạy
        List<Promotion> activePromotions = promotionRepository.findAllActiveAutomaticPromotions(LocalDateTime.now());
        // 2. Lấy ID danh mục của sản phẩm này
        Set<Long> categoryIds = product.getCategories().stream()
                .map(Category::getId)
                .collect(Collectors.toSet());

        List<BigDecimal> possiblePrices = new ArrayList<>();

        // 3. Duyệt qua từng khuyến mãi
        for (Promotion promo : activePromotions) {
            // Kiểm tra xem khuyến mãi này có áp dụng cho sản phẩm không
            boolean appliesToProduct = promo.getProducts().stream()
                    .anyMatch(p -> p.getId().equals(product.getId()));
            boolean appliesToCategory = promo.getCategories().stream()
                    .anyMatch(c -> categoryIds.contains(c.getId()));

            // Khuyến mãi toàn cửa hàng (không set sản phẩm, không set danh mục)
            boolean appliesToAll = promo.getProducts().isEmpty() && promo.getCategories().isEmpty();

            if (appliesToProduct || appliesToCategory || appliesToAll) {
                // Nếu có, tính giá mới
                BigDecimal newPrice = calculateDiscountedPrice(originalPrice, promo);
                possiblePrices.add(newPrice);
            }
        }

        // 4. Nếu không có giá nào, trả về empty
        if (possiblePrices.isEmpty()) {
            return Optional.empty();
        }

        // 5. Tìm giá thấp nhất trong các khuyến mãi
        BigDecimal bestPrice = Collections.min(possiblePrices);
        // Đảm bảo giá khuyến mãi không vô lý (ví dụ: cao hơn giá gốc)
        if (bestPrice.compareTo(originalPrice) >= 0) {
            return Optional.empty();
        }

        // Làm tròn tiền (ví dụ: làm tròn đến 1000đ)
        bestPrice = bestPrice.setScale(-3, RoundingMode.HALF_UP); // Làm tròn đến hàng nghìn
        return Optional.of(bestPrice);
    }

    /**
     * Helper tính toán giá dựa trên loại khuyến mãi
     */
    private BigDecimal calculateDiscountedPrice(BigDecimal original, Promotion promo) {
        if (PromotionType.PERCENTAGE==promo.getType()) {
            BigDecimal discountPercent = promo.getValue().divide(new BigDecimal("100"));
            BigDecimal discountAmount = original.multiply(discountPercent);
            // Kiểm tra "Giảm tối đa"
            if (promo.getMaxDiscountValue() != null && discountAmount.compareTo(promo.getMaxDiscountValue()) > 0) {
                discountAmount = promo.getMaxDiscountValue();
            }
            return original.subtract(discountAmount);

        } else if ("FIXED_AMOUNT".equals(promo.getType())) {
            BigDecimal newPrice = original.subtract(promo.getValue());
            // Đảm bảo giá không bị âm
            return newPrice.compareTo(BigDecimal.ZERO) > 0 ? newPrice : BigDecimal.ZERO;
        }

        return original; // Không có loại khuyến mãi
    }
}
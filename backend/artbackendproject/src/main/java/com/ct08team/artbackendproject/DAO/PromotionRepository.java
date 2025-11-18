// Giả sử file này ở trong package DAO
package com.ct08team.artbackendproject.DAO;

import com.ct08team.artbackendproject.Entity.promotion.Promotion; // Giả sử bạn có Entity này
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Long> {
    Optional<Promotion> findByCode(String code);

    /**
     * Truy vấn cốt lõi: Lấy TẤT CẢ khuyến mãi đang hoạt động,
     * còn hạn, và là loại TỰ ĐỘNG (không phải mã coupon)
     *
     * Chúng ta dùng LEFT JOIN FETCH để lấy luôn các sản phẩm/danh mục
     * liên quan trong 1 truy vấn (Eager Loading)
     */
    @Query("SELECT p FROM Promotion p " +
            "LEFT JOIN FETCH p.products " +
            "LEFT JOIN FETCH p.categories " +
            "WHERE p.isActive = true " +
            "AND p.code IS NULL " + // code IS NULL nghĩa là khuyến mãi tự động (SALE)
            "AND p.endDate > :now")
    List<Promotion> findAllActiveAutomaticPromotions(@Param("now") LocalDateTime now);
}
package com.ct08team.artbackendproject.Entity.promotion;

// Các import từ package entity sản phẩm của bạn
import com.ct08team.artbackendproject.Entity.product.Category;
import com.ct08team.artbackendproject.Entity.product.Product;

// Import JPA và các kiểu dữ liệu
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "promotions")
@Data // Tạo getters, setters, toString, equals, hashCode
@NoArgsConstructor // Constructor rỗng
@AllArgsConstructor // Constructor đầy đủ
@Builder // Builder pattern
public class Promotion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "image_url", length = 512)
    private String imageUrl;

    @Column(name = "code", unique = true, length = 50)
    private String code; // NULL = Sale tự động, NOT NULL = Coupon

    @Enumerated(EnumType.STRING) // Lưu Enum dưới dạng chuỗi ("PERCENTAGE", "FIXED_AMOUNT")
    @Column(name = "type", nullable = false, length = 20)
    private PromotionType type;

    @Column(name = "value", nullable = false, precision = 10, scale = 2)
    private BigDecimal value;

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true; // Giá trị default

    @Column(name = "min_order_value", precision = 15, scale = 2)
    private BigDecimal minOrderValue;

    @Column(name = "max_discount_value", precision = 15, scale = 2)
    private BigDecimal maxDiscountValue; // Dùng cho "Giảm % tối đa ...K"

    @Column(name = "usage_limit")
    private Integer usageLimit; // Dùng Integer vì có thể là NULL

    @Column(name = "usage_count", nullable = false)
    private int usageCount = 0; // Giá trị default

    // ===================================
    // ĐỊNH NGHĨA QUAN HỆ
    // ===================================

    /**
     * Các sản phẩm cụ thể được áp dụng khuyến mãi này.
     * Liên kết qua bảng "promotion_products".
     */
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "promotion_products",
            joinColumns = @JoinColumn(name = "promotion_id"),
            inverseJoinColumns = @JoinColumn(name = "product_id")
    )
    private Set<Product> products = new HashSet<>();

    /**
     * Các danh mục cụ thể được áp dụng khuyến mãi này.
     * Liên kết qua bảng "promotion_categories".
     */
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "promotion_categories",
            joinColumns = @JoinColumn(name = "promotion_id"),
            inverseJoinColumns = @JoinColumn(name = "categories_id")
    )
    private Set<Category> categories = new HashSet<>();

    // Bạn có thể thêm các liên kết khác nếu cần, ví dụ như tới `order_promotions`
    // @OneToMany(mappedBy = "promotion")
    // private Set<OrderPromotion> orders;
}
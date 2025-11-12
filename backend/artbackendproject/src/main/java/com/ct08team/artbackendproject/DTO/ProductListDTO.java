package com.ct08team.artbackendproject.DTO;

import java.math.BigDecimal;

/**
 * DTO (Data Transfer Object) để hiển thị sản phẩm trên một danh sách (list).
 * Chứa thông tin rút gọn, bao gồm cả giá gốc và giá khuyến mãi (nếu có).
 */
public class ProductListDTO {

    private Long id;
    private String productName;
    private String thumbnail;

    /**
     * Giá gốc của sản phẩm (lấy từ product.minPrice).
     */
    private BigDecimal originalPrice;

    /**
     * Giá đã giảm sau khi áp dụng khuyến mãi tự động (SALE).
     * Sẽ là NULL nếu không có khuyến mãi nào được áp dụng.
     */
    private BigDecimal promotionalPrice;

    /**
     * Constructor rỗng (cần thiết cho JPA/Jackson).
     */
    public ProductListDTO() {
    }

    /**
     * Constructor đầy đủ để ánh xạ từ ProductService.
     */
    public ProductListDTO(Long id, String productName, String thumbnail, BigDecimal originalPrice, BigDecimal promotionalPrice) {
        this.id = id;
        this.productName = productName;
        this.thumbnail = thumbnail;
        this.originalPrice = originalPrice;
        this.promotionalPrice = promotionalPrice;
    }

    // --- Getters và Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getThumbnail() {
        return thumbnail;
    }

    public void setThumbnail(String thumbnail) {
        this.thumbnail = thumbnail;
    }

    public BigDecimal getOriginalPrice() {
        return originalPrice;
    }

    public void setOriginalPrice(BigDecimal originalPrice) {
        this.originalPrice = originalPrice;
    }

    public BigDecimal getPromotionalPrice() {
        return promotionalPrice;
    }

    public void setPromotionalPrice(BigDecimal promotionalPrice) {
        this.promotionalPrice = promotionalPrice;
    }
}
package com.ct08team.artbackendproject.DTO.Filter;

import java.math.BigDecimal;

/**
 * DTO để chứa khoảng giá (min/max) của các sản phẩm.
 * Sử dụng BigDecimal để đảm bảo độ chính xác cho tiền tệ.
 */
public class PriceRangeDTO {

    private BigDecimal minPrice;
    private BigDecimal maxPrice;

    // Constructor rỗng
    public PriceRangeDTO() {
    }

    // Constructor tiện lợi
    public PriceRangeDTO(BigDecimal minPrice, BigDecimal maxPrice) {
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
    }

    // --- Getters and Setters ---

    public BigDecimal getMinPrice() {
        return minPrice;
    }

    public void setMinPrice(BigDecimal minPrice) {
        this.minPrice = minPrice;
    }

    public BigDecimal getMaxPrice() {
        return maxPrice;
    }

    public void setMaxPrice(BigDecimal maxPrice) {
        this.maxPrice = maxPrice;
    }
}

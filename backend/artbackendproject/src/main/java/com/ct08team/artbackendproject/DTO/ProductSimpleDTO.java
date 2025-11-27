package com.ct08team.artbackendproject.DTO;

import com.ct08team.artbackendproject.Entity.product.Product;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductSimpleDTO {
    private Long id;
    private String productName;
    private String thumbnail;
    private BigDecimal minPrice;

    public ProductSimpleDTO(Product product) {
        this.id = product.getId();
        this.productName = product.getProductName();
        this.thumbnail = product.getThumbnail();
        this.minPrice = product.getMinPrice();
    }
}
package com.ct08team.artbackendproject.Entity.product;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.Objects;

@Entity
@Table(name = "product_variants")
@IdClass(ProductVariantId.class)
public class ProductVariant {
    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
    
    @Id
    @Column(name = "dimensions", length = 20, nullable = false)
    private String dimensions;
    
    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    
    @Column(name = "stock_quantity", nullable = false)
    private Long stockQuantity = 0L;
    
    @Column(name = "variant_status", nullable = false)
    private Integer variantStatus = 1;
    
    public ProductVariant() {
    }
    
    public ProductVariant(Product product, String dimensions, BigDecimal price, 
                         Long stockQuantity, Integer variantStatus) {
        this.product = product;
        this.dimensions = dimensions;
        this.price = price;
        this.stockQuantity = stockQuantity;
        this.variantStatus = variantStatus;
    }
    
    public Product getProduct() {
        return product;
    }
    
    public void setProduct(Product product) {
        this.product = product;
    }
    
    public String getDimensions() {
        return dimensions;
    }
    
    public void setDimensions(String dimensions) {
        this.dimensions = dimensions;
    }
    
    public BigDecimal getPrice() {
        return price;
    }
    
    public void setPrice(BigDecimal price) {
        this.price = price;
    }
    
    public Long getStockQuantity() {
        return stockQuantity;
    }
    
    public void setStockQuantity(Long stockQuantity) {
        this.stockQuantity = stockQuantity;
    }
    
    public Integer getVariantStatus() {
        return variantStatus;
    }
    
    public void setVariantStatus(Integer variantStatus) {
        this.variantStatus = variantStatus;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProductVariant that = (ProductVariant) o;
        return Objects.equals(product.getId(), that.product.getId()) && 
               Objects.equals(dimensions, that.dimensions);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(product.getId(), dimensions);
    }
}
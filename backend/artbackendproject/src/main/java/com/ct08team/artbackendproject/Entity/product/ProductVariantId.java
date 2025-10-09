package com.ct08team.artbackendproject.Entity.product;

import java.io.Serializable;
import java.util.Objects;

public class ProductVariantId implements Serializable {
    private Long product;
    private String dimensions;
    
    public ProductVariantId() {
    }
    
    public ProductVariantId(Long product, String dimensions) {
        this.product = product;
        this.dimensions = dimensions;
    }
    
    public Long getProduct() {
        return product;
    }
    
    public void setProduct(Long product) {
        this.product = product;
    }
    
    public String getDimensions() {
        return dimensions;
    }
    
    public void setDimensions(String dimensions) {
        this.dimensions = dimensions;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProductVariantId that = (ProductVariantId) o;
        return Objects.equals(product, that.product) && 
               Objects.equals(dimensions, that.dimensions);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(product, dimensions);
    }
}
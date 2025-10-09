package com.ct08team.artbackendproject.Entity.product;

import java.io.Serializable;
import java.util.Objects;

public class ProductColorId implements Serializable {
    private Long product;
    private String hexCode;
    
    public ProductColorId() {
    }
    
    public ProductColorId(Long product, String hexCode) {
        this.product = product;
        this.hexCode = hexCode;
    }
    
    public Long getProduct() {
        return product;
    }
    
    public void setProduct(Long product) {
        this.product = product;
    }
    
    public String getHexCode() {
        return hexCode;
    }
    
    public void setHexCode(String hexCode) {
        this.hexCode = hexCode;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProductColorId that = (ProductColorId) o;
        return Objects.equals(product, that.product) && 
               Objects.equals(hexCode, that.hexCode);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(product, hexCode);
    }
}
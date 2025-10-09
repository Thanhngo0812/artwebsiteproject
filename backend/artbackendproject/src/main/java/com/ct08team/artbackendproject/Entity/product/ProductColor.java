package com.ct08team.artbackendproject.Entity.product;

import jakarta.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "product_colors")
@IdClass(ProductColorId.class)
public class ProductColor {
    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
    
    @Id
    @Column(name = "hex_code", length = 7, nullable = false)
    private String hexCode;
    
    public ProductColor() {
    }
    
    public ProductColor(Product product, String hexCode) {
        this.product = product;
        this.hexCode = hexCode;
    }
    
    public Product getProduct() {
        return product;
    }
    
    public void setProduct(Product product) {
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
        ProductColor that = (ProductColor) o;
        return Objects.equals(product.getId(), that.product.getId()) && 
               Objects.equals(hexCode, that.hexCode);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(product.getId(), hexCode);
    }
}
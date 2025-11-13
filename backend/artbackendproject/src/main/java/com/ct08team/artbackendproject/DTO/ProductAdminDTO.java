package com.ct08team.artbackendproject.DTO;


import com.ct08team.artbackendproject.Entity.product.Category;
import com.ct08team.artbackendproject.Entity.product.Material;
import com.ct08team.artbackendproject.Entity.product.Product;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

/**
 * DTO này trả về dữ liệu cho bảng Admin (ProductAdmin.jsx)
 */
public class ProductAdminDTO {

    private Long id;
    private String thumbnail;
    private String productName;
    private List<String> categories;
    private String material;
    private BigDecimal minPrice;
    private Integer productStatus;
    private Instant createdAt;

    // Constructor để chuyển đổi từ Entity
    public ProductAdminDTO(Product product) {
        this.id = product.getId();
        this.thumbnail = product.getThumbnail();
        this.productName = product.getProductName();
        this.minPrice = product.getMinPrice();
        this.productStatus = product.getProductStatus();
        this.createdAt = product.getCreatedAt();

        // Map Category Entities (Set) sang Category Names (List)
        if (product.getCategories() != null) {
            this.categories = product.getCategories().stream()
                    .map(Category::getName)
                    .collect(Collectors.toList());
        }

        // Map Material Entity sang Material Name
        if (product.getMaterial() != null) {
            this.material = product.getMaterial().getMaterialName();
        }
    }

    // Getters & Setters (Cần thiết cho Jackson)
    public Long getId() { return id; }
    public String getThumbnail() { return thumbnail; }
    public String getProductName() { return productName; }
    public List<String> getCategories() { return categories; }
    public String getMaterial() { return material; }
    public BigDecimal getMinPrice() { return minPrice; }
    public Integer getProductStatus() { return productStatus; }
    public Instant getCreatedAt() { return createdAt; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setThumbnail(String thumbnail) { this.thumbnail = thumbnail; }
    public void setProductName(String productName) { this.productName = productName; }
    public void setCategories(List<String> categories) { this.categories = categories; }
    public void setMaterial(String material) { this.material = material; }
    public void setMinPrice(BigDecimal minPrice) { this.minPrice = minPrice; }
    public void setProductStatus(Integer productStatus) { this.productStatus = productStatus; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
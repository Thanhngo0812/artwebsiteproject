package com.ct08team.artbackendproject.Entity.product;


import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "product_variants")
public class ProductVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "variant_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "dimensions", length = 20, nullable = false)
    private String dimensions;

    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "stock_quantity", nullable = false)
    private Long stockQuantity = 0L;

    @Column(name = "variant_status", nullable = false)
    private Integer variantStatus = 1;

    @Column(name = "cost_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal costPrice;

    // Quan hệ với ProductImage
    @OneToMany(mappedBy = "variant", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ProductImage> images = new ArrayList<>();

    // Constructors
    public ProductVariant() {
    }

    public ProductVariant(Long id, Product product, String dimensions,
                          BigDecimal price, BigDecimal costPrice,Long stockQuantity, Integer variantStatus) {
        this.id = id;
        this.product = product;
        this.dimensions = dimensions;
        this.price = price;
        this.stockQuantity = stockQuantity;
        this.variantStatus = variantStatus;
        this.costPrice = costPrice;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public BigDecimal getCostPrice() {
        return costPrice;
    }

    public void setCostPrice(BigDecimal costPrice) {
        this.costPrice = costPrice;
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

    public List<ProductImage> getImages() {
        return images;
    }

    public void setImages(List<ProductImage> images) {
        this.images = images;
    }

    // Helper methods
    public void addImage(ProductImage image) {
        images.add(image);
        image.setVariant(this);
    }

    public void removeImage(ProductImage image) {
        images.remove(image);
        image.setVariant(null);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProductVariant that = (ProductVariant) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
package com.ct08team.artbackendproject.Entity.product;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "product")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "productname", unique = true, nullable = false)
    private String productName;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "material_id", nullable = false)
    private Material material;
    
    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "thumbnail", length = 512)
    private String thumbnail;
    
    @Column(name = "product_status", nullable = false)
    private Integer productStatus;
    
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ProductColor> colors = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ProductTopic> topics = new ArrayList<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "product_categories",
        joinColumns = @JoinColumn(name = "product_id"),
        inverseJoinColumns = @JoinColumn(name = "categories_id")
    )
    private Set<Category> categories = new HashSet<>();
    
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ProductVariant> variants = new ArrayList<>();

    @Column(name = "min_price")
    private BigDecimal minPrice;

    @Column(name = "sales_count")
    private Long salesCount;

    @Column(name = "view_count")
    private Long viewCount;
    public Product() {
    }

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
    
    public Product(Long id, String productName, Material material, String description, 
                   String thumbnail, Integer productStatus, BigDecimal minPrice, Long salesCount, Long viewCount) {
        this.id = id;
        this.productName = productName;
        this.material = material;
        this.description = description;
        this.thumbnail = thumbnail;
        this.productStatus = productStatus;
        this.minPrice = minPrice;
        this.salesCount = salesCount;
        this.viewCount = viewCount;
    }
    
    // Getters and Setters
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
    
    public Material getMaterial() {
        return material;
    }
    
    public void setMaterial(Material material) {
        this.material = material;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getThumbnail() {
        return thumbnail;
    }
    
    public void setThumbnail(String thumbnail) {
        this.thumbnail = thumbnail;
    }
    
    public Integer getProductStatus() {
        return productStatus;
    }
    
    public void setProductStatus(Integer productStatus) {
        this.productStatus = productStatus;
    }
    
    public List<ProductColor> getColors() {
        return colors;
    }
    
    public void setColors(List<ProductColor> colors) {
        this.colors = colors;
    }

    public List<ProductTopic> getTopics() {
        return topics;
    }

    public void setTopics(List<ProductTopic> topics) {
        this.topics= topics;
    }
    
    public Set<Category> getCategories() {
        return categories;
    }
    
    public void setCategories(Set<Category> categories) {
        this.categories = categories;
    }
    
    public List<ProductVariant> getVariants() {
        return variants;
    }
    
    public void setVariants(List<ProductVariant> variants) {
        this.variants = variants;
    }


    public BigDecimal getMinPrice() {
        return minPrice;
    }

    public void setMinPrice(BigDecimal minPrice) {
        this.minPrice = minPrice;
    }

    public Long getSalesCount() {
        return salesCount;
    }

    public void setSalesCount(Long salesCount) {
        this.salesCount = salesCount;
    }

    public Long getViewCount() {
        return viewCount;
    }

    public void setViewCount(Long viewCount) {
        this.viewCount = viewCount;
    }

    // =======================================================
    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
    // Helper methods
    public void addColor(ProductColor color) {
        colors.add(color);
        color.setProduct(this);
    }
    
    public void removeColor(ProductColor color) {
        colors.remove(color);
        color.setProduct(null);
    }
    
    public void addCategory(Category category) {
        categories.add(category);
        category.getProducts().add(this);
    }
    
    public void removeCategory(Category category) {
        categories.remove(category);
        category.getProducts().remove(this);
    }
    
    public void addVariant(ProductVariant variant) {
        variants.add(variant);
        variant.setProduct(this);
    }
    
    public void removeVariant(ProductVariant variant) {
        variants.remove(variant);
        variant.setProduct(null);
    }

    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Product product = (Product) o;
        return Objects.equals(id, product.id);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}

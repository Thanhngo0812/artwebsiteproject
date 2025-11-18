package com.ct08team.artbackendproject.Entity;

import com.ct08team.artbackendproject.Entity.product.ProductVariant;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.math.BigDecimal;

/**
 * Map (Ánh xạ) tới bảng 'order_items' (Bảng 14)
 */
@Entity
@Table(name = "order_items")
@Data // Lombok
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})

public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Liên kết với Order (Cha)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @JsonIgnore // Tránh đệ quy
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Order order;

    // Liên kết với ProductVariant (Biến thể sản phẩm đã mua)
    // (CSDL của bạn dùng ON DELETE NO ACTION)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private ProductVariant variant;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "price_at_purchase", nullable = false)
    private BigDecimal priceAtPurchase;

    @Column(name = "discount_applied", nullable = false)
    private BigDecimal discountApplied;

    @Column(name = "cost_price_at_purchase", nullable = false)
    private BigDecimal costPriceAtPurchase;
}
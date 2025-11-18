package com.ct08team.artbackendproject.Entity;


import com.ct08team.artbackendproject.Entity.auth.User;
import com.ct08team.artbackendproject.Entity.promotion.Promotion;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Map (Ánh xạ) tới bảng 'orders'
 */
@Entity
@Table(name = "orders")
@Data // Lombok
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Liên kết với User
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore // Tránh đệ quy
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User user;

    // ============================================
    // CÁC CỘT MỚI (Từ Lựa chọn 1 của bạn)
    // (CSDL là 'customer_name', JPA tự động map tới 'customerName')
    // ============================================
    @Column(name = "customer_name")
    private String customerName;

    @Column(name = "customer_phone")
    private String customerPhone;
    // ============================================

    // Các trường địa chỉ (lưu snapshot)
    @Column(columnDefinition = "TEXT", nullable = false)
    private String address;

    @Column(precision = 10, scale = 8)
    private BigDecimal latitude;

    @Column(precision = 11, scale = 8)
    private BigDecimal longitude;

    // Các trường tài chính
    @Column(name = "subtotal_price", nullable = false)
    private BigDecimal subtotalPrice;

    @Column(name = "shipping_fee", nullable = false)
    private BigDecimal shippingFee;

    @Column(name = "discount_amount", nullable = false)
    private BigDecimal discountAmount;

    @Column(name = "total_price", nullable = false)
    private BigDecimal totalPrice;

    // Các trường trạng thái
    @Column(name = "order_status", nullable = false)
    private String orderStatus;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "payment_status", nullable = false)
    private String paymentStatus;

    // Dấu thời gian
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    // --- Mối quan hệ ---

    // Liên kết với OrderItems
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<OrderItem> orderItems = new ArrayList<>();

    // Liên kết với Promotions (Lưu các mã đã dùng)
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "order_promotions",
            joinColumns = @JoinColumn(name = "order_id"),
            inverseJoinColumns = @JoinColumn(name = "promotion_id")
    )
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<Promotion> promotions = new HashSet<>();

    // --- Helper Methods ---
    // (Giúp 'OrderService' (file 'com/ct08team/artbackendproject/Service/Order/OrderService.java') dễ dàng hơn)
    public void addOrderItem(OrderItem item) {
        orderItems.add(item);
        item.setOrder(this);
    }
}
package com.ct08team.artbackendproject.Entity.promotion;


import com.ct08team.artbackendproject.Entity.Order;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "order_promotions")
public class OrderPromotion {

    // Lấy order_id làm khóa chính luôn
    @Id
    @Column(name = "order_id")
    private Long orderId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId // Hibernate sẽ copy ID từ Order bỏ vào biến orderId ở trên
    @JoinColumn(name = "order_id")
    @JsonBackReference
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "promotion_id", nullable = false)
    private Promotion promotion;

    @Column(name = "discount_applied_for_this_order", nullable = false)
    private BigDecimal discountApplied;

    public OrderPromotion() {}

    public OrderPromotion(Order order, Promotion promotion, BigDecimal discountApplied) {
        this.order = order;
        this.promotion = promotion;
        this.discountApplied = discountApplied;
    }

    // Getters and Setters
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }

    public Promotion getPromotion() { return promotion; }
    public void setPromotion(Promotion promotion) { this.promotion = promotion; }

    public BigDecimal getDiscountApplied() { return discountApplied; }
    public void setDiscountApplied(BigDecimal discountApplied) { this.discountApplied = discountApplied; }
}
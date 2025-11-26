package com.ct08team.artbackendproject.Entity.promotion;

import com.ct08team.artbackendproject.Entity.Order;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "order_promotions")
public class OrderPromotion {

    @EmbeddedId
    private OrderPromotionKey id = new OrderPromotionKey();

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("orderId") // Map với field orderId trong Key
    @JoinColumn(name = "order_id")
    @JsonBackReference
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("promotionId") // Map với field promotionId trong Key
    @JoinColumn(name = "promotion_id")
    private Promotion promotion;

    @Column(name = "discount_applied_for_this_order", nullable = false)
    private BigDecimal discountApplied;

    // Constructors
    public OrderPromotion() {}

    public OrderPromotion(Order order, Promotion promotion, BigDecimal discountApplied) {
        this.order = order;
        this.promotion = promotion;
        this.discountApplied = discountApplied;
        this.id = new OrderPromotionKey(order.getId(), promotion.getId());
    }

    // Getters and Setters
    public OrderPromotionKey getId() { return id; }
    public void setId(OrderPromotionKey id) { this.id = id; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }

    public Promotion getPromotion() { return promotion; }
    public void setPromotion(Promotion promotion) { this.promotion = promotion; }

    public BigDecimal getDiscountApplied() { return discountApplied; }
    public void setDiscountApplied(BigDecimal discountApplied) { this.discountApplied = discountApplied; }
}
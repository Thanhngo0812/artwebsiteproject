package com.ct08team.artbackendproject.Entity.promotion;


import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class OrderPromotionKey implements Serializable {

    @Column(name = "order_id")
    private Long orderId;

    @Column(name = "promotion_id")
    private Long promotionId;

    public OrderPromotionKey() {}

    public OrderPromotionKey(Long orderId, Long promotionId) {
        this.orderId = orderId;
        this.promotionId = promotionId;
    }

    // Getters, Setters, hashCode, equals (Bắt buộc cho Composite Key)
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public Long getPromotionId() { return promotionId; }
    public void setPromotionId(Long promotionId) { this.promotionId = promotionId; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        OrderPromotionKey that = (OrderPromotionKey) o;
        return Objects.equals(orderId, that.orderId) && Objects.equals(promotionId, that.promotionId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(orderId, promotionId);
    }
}
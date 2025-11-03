package com.ct08team.artbackendproject.Entity.product;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class ProductTopicId implements Serializable {

    @Column(name = "product_id")
    private Long productId;

    @Column(name = "topic_name")
    private String topicName;

    // Constructor rỗng (bắt buộc)
    public ProductTopicId() {
    }

    public ProductTopicId(Long productId, String topicName) {
        this.productId = productId;
        this.topicName = topicName;
    }

    // Getters, Setters
    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getTopicName() {
        return topicName;
    }

    public void setTopicName(String topicName) {
        this.topicName = topicName;
    }

    // equals() và hashCode() (rất quan trọng)
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProductTopicId that = (ProductTopicId) o;
        return Objects.equals(productId, that.productId) &&
                Objects.equals(topicName, that.topicName);
    }

    @Override
    public int hashCode() {
        return Objects.hash(productId, topicName);
    }
}
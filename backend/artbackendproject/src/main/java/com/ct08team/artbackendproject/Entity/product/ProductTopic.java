package com.ct08team.artbackendproject.Entity.product;


import jakarta.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "product_topics")
public class ProductTopic {

    @EmbeddedId
    private ProductTopicId id;
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("productId") // Ánh xạ tới trường 'productId' trong ProductTopicId
    @JoinColumn(name = "product_id")
    private Product product;

    // Constructor rỗng
    public ProductTopic() {
    }

    // Constructor tiện lợi
    public ProductTopic(Product product, String topicName) {
        this.product = product;
        this.id = new ProductTopicId(product.getId(), topicName);
    }

    // Getters and Setters
    public ProductTopicId getId() {
        return id;
    }

    public void setId(ProductTopicId id) {
        this.id = id;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    // Getter tiện lợi để lấy topicName
    public String getTopicName() {
        return (this.id != null) ? this.id.getTopicName() : null;
    }
    public void setTopicName(String topicName) {
        // Khởi tạo nếu id vẫn null (an toàn)
        if (this.id == null) {
            this.id = new ProductTopicId();
        }
        this.id.setTopicName(topicName);
    }

    // equals() và hashCode()
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProductTopic that = (ProductTopic) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
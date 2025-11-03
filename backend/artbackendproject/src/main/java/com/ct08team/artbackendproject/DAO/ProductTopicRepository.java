package com.ct08team.artbackendproject.DAO;

import com.ct08team.artbackendproject.Entity.product.ProductTopic;
import com.ct08team.artbackendproject.Entity.product.ProductTopicId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductTopicRepository extends JpaRepository<ProductTopic, ProductTopicId> {

    // Tìm tất cả chủ đề của một sản phẩm
    List<ProductTopic> findByProductId(Long productId);

    // Tìm tất cả sản phẩm có một chủ đề nhất định
    List<ProductTopic> findByIdTopicName(String topicName);

    // Lấy danh sách các tên chủ đề duy nhất (để làm filter)
    @Query("SELECT DISTINCT pt.id.topicName FROM ProductTopic pt")
    List<String> findDistinctTopicNames();

    @Query("SELECT DISTINCT pt.id.topicName FROM ProductTopic pt WHERE pt.product.id IN :productIds")
    List<String> findDistinctTopicNamesByProductIds(@Param("productIds") List<Long> productIds);
}
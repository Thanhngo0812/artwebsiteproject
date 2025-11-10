package com.ct08team.artbackendproject.DAO;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.ct08team.artbackendproject.Entity.product.ProductVariant;
import com.ct08team.artbackendproject.Entity.product.Product;

@Repository
// Chữ Long này bây giờ tham chiếu đến khóa chính MỚI: variant_id (Rất chính xác)
public interface ProductVariantRepository extends JpaRepository<ProductVariant,Long> {

    // Giữ nguyên, query method này hoạt động dựa trên quan hệ @ManyToOne
    List<ProductVariant> findByProduct(Product product);

    // Giữ nguyên, hoạt động tốt
    List<ProductVariant> findByVariantStatus(Integer variantStatus);

    // ...

    // ===== ĐÃ SỬA =====
    // Bỏ ".id" vì "dimensions" giờ là một trường (field) trực tiếp của ProductVariant
    @Query("SELECT DISTINCT pv.dimensions FROM ProductVariant pv")
    List<String> findDistinctDimensions();

    // ===== ĐÃ SỬA =====
    // Bỏ ".id" ở "pv.dimensions".
    // "pv.product.id" vẫn đúng (truy cập vào ID của đối tượng Product liên kết)
    @Query("SELECT DISTINCT pv.dimensions FROM ProductVariant pv WHERE pv.product.id IN :productIds")
    List<String> findDistinctDimensionsByProductIds(@Param("productIds") List<Long> productIds);

    // (Giữ nguyên, không bị ảnh hưởng bởi thay đổi khóa chính)
    @Query("SELECT MIN(pv.price) FROM ProductVariant pv WHERE pv.variantStatus = 1")
    BigDecimal findMinPrice();

    // (Giữ nguyên, không bị ảnh hưởng)
    @Query("SELECT MAX(pv.price) FROM ProductVariant pv WHERE pv.variantStatus = 1")
    BigDecimal findMaxPrice();

    // (Giữ nguyên, "v.product.id" là cách truy vấn chính xác)
    @Query("SELECT v FROM ProductVariant v WHERE v.product.id = :productId")
    Page<ProductVariant> findByProductId(@Param("productId") Long productId, Pageable pageable);
}
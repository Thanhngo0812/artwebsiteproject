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
import com.ct08team.artbackendproject.Entity.product.ProductVariantId;
import com.ct08team.artbackendproject.Entity.product.Product;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, ProductVariantId> {
    List<ProductVariant> findByProduct(Product product);
    // List<ProductVariant> findByProductId(Long productId);
    List<ProductVariant> findByVariantStatus(Integer variantStatus);
    // ...
    @Query("SELECT DISTINCT pv.id.dimensions FROM ProductVariant pv")
    List<String> findDistinctDimensions();

    @Query("SELECT DISTINCT pv.id.dimensions FROM ProductVariant pv WHERE pv.product.id IN :productIds")
    List<String> findDistinctDimensionsByProductIds(@Param("productIds") List<Long> productIds);

// (Bạn cũng cần hàm lấy min/max price tổng cho lần tải đầu tiên)
    @Query("SELECT MIN(pv.price) FROM ProductVariant pv WHERE pv.variantStatus = 1")
    BigDecimal findMinPrice();

    // ===== HÀM MỚI ĐỂ LẤY MAX PRICE TỔNG =====
    /**
     * Tìm giá cao nhất trong TẤT CẢ các biến thể sản phẩm.
     */
    @Query("SELECT MAX(pv.price) FROM ProductVariant pv WHERE pv.variantStatus = 1")
    BigDecimal findMaxPrice();

    @Query("SELECT v FROM ProductVariant v WHERE v.product.id = :productId")
    Page<ProductVariant> findByProductId(@Param("productId") Long productId, Pageable pageable);
}
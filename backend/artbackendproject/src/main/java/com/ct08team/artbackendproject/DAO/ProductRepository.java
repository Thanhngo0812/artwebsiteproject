package com.ct08team.artbackendproject.DAO;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.ct08team.artbackendproject.Entity.product.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    
    @Query("SELECT p FROM Product p " +
           "LEFT JOIN FETCH p.categories " +
           "LEFT JOIN FETCH p.material " +
           "WHERE p.id = :id")
    Optional<Product> findByIdWithDetails(@Param("id") Long id);
    @Query("SELECT p FROM Product p " +
           "LEFT JOIN FETCH p.variants " +
           "WHERE p.id = :id")
    Optional<Product> findByIdWithVariants(@Param("id") Long id);

    @Query("SELECT p FROM Product p " +
           "LEFT JOIN FETCH p.colors " +
           "WHERE p.id = :id")
    Optional<Product> findByIdWithColors(@Param("id") Long id);

    @Query("SELECT DISTINCT p FROM Product p " +
           "JOIN p.categories c " +
           "WHERE c.id = :categoryId AND p.productStatus = 1")
    Page<Product> findByCategoryId(@Param("categoryId") Long categoryId, Pageable pageable);

    @Query("SELECT p FROM Product p " +
           "WHERE p.productStatus = 1 " +
           "ORDER BY p.salesCount DESC, p.viewCount DESC")
    Page<Product> findFeaturedProducts(Pageable pageable);

    @Query("SELECT p FROM Product p " +
           "WHERE p.productStatus = 1 " +
           "ORDER BY p.createdAt DESC")
    Page<Product> findNewestProducts(Pageable pageable);

    // SỬA LẠI ĐOẠN NAY:
    @Query("SELECT p FROM Product p JOIN p.categories c WHERE c.id = :categoryId AND p.productStatus = :status")
    Page<Product> findByCategoryIdAndProductStatus(
            @Param("categoryId") Long categoryId,
            @Param("status") Integer status,
            Pageable pageable
    );
    // Tìm tất cả theo Status (dùng cho Newest và Featured)
    List<Product> findByProductStatus(Integer status); // Trả về List để tính điểm Featured
    Page<Product> findByProductStatus(Integer status, Pageable pageable); // Trả về Page cho Newest
}
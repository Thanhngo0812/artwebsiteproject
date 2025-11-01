package com.ct08team.artbackendproject.DAO;
import com.ct08team.artbackendproject.Entity.product.*;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductColorRepository extends JpaRepository<ProductColor, ProductColorId> {
    List<ProductColor> findByProduct(Product product);
    List<ProductColor> findByProductId(Long productId);
    @Query("SELECT DISTINCT pc.id.hexCode FROM ProductColor pc")
    List<String> findDistinctHexCodes();

    // --- HÀM 2 BỊ THIẾU ---
    @Query("SELECT DISTINCT pc.id.hexCode FROM ProductColor pc WHERE pc.product.id IN :productIds")
    List<String> findDistinctHexCodesByProductIds(@Param("productIds") List<Long> productIds);
}
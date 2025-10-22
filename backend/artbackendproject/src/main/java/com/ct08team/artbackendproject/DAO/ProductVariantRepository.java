package com.ct08team.artbackendproject.DAO;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.ct08team.artbackendproject.Entity.product.ProductVariant;
import com.ct08team.artbackendproject.Entity.product.ProductVariantId;
import com.ct08team.artbackendproject.Entity.product.Product;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, ProductVariantId> {
    List<ProductVariant> findByProduct(Product product);
    List<ProductVariant> findByProductId(Long productId);
    List<ProductVariant> findByVariantStatus(Integer variantStatus);
}
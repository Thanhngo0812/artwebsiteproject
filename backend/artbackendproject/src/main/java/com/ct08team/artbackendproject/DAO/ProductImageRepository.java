package com.ct08team.artbackendproject.DAO;

import java.util.List;

import com.ct08team.artbackendproject.Entity.product.Product;
import com.ct08team.artbackendproject.Entity.product.ProductImage;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {
    List<ProductImage> findByProduct(Product product);
    List<ProductImage> findByProductId(Long productId);
}
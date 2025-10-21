package com.ct08team.artbackendproject.DAO;

import org.springframework.stereotype.Repository;

import com.ct08team.artbackendproject.Entity.product.Category;
import com.ct08team.artbackendproject.Entity.product.Material;
import com.ct08team.artbackendproject.Entity.product.Product;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findByProductName(String productName);
    List<Product> findByProductStatus(Integer productStatus);
    List<Product> findByMaterial(Material material);
    List<Product> findByMaterialId(Long materialId);
    List<Product> findByCategoriesContaining(Category category);
    boolean existsByProductName(String productName);
}
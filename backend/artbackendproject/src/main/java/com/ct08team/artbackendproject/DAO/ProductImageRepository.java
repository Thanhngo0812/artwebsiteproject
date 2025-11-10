package com.ct08team.artbackendproject.DAO;

import java.util.List;

import com.ct08team.artbackendproject.Entity.product.Product;
import com.ct08team.artbackendproject.Entity.product.ProductImage;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {
    // === CÁCH SỬA LẠI (DÙNG ID) ===
    // Tên phương thức này có nghĩa là:
    // "Tìm ProductImage BẰNG cách đi vào trường 'variant',
    // rồi đi vào trường 'product' của variant đó,
    // rồi lấy trường 'id' của product đó"
    List<ProductImage> findByVariantProductId(Long productId);


    // === CÁC PHƯƠNG THỨC HỮU DỤNG KHÁC ===

    // Lấy tất cả ảnh cho MỘT BIẾN THỂ cụ thể (rất phổ biến)
    List<ProductImage> findByVariantId(Long variantId);
}
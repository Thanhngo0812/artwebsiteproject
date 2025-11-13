package com.ct08team.artbackendproject.Specification;

import com.ct08team.artbackendproject.Entity.product.Category;
import com.ct08team.artbackendproject.Entity.product.Material;
import com.ct08team.artbackendproject.Entity.product.Product;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Lớp này xây dựng câu lệnh query động (Specification)
 * cho trang Quản lý Sản phẩm (Admin).
 */
public class ProductAdminSpecification {

    public static Specification<Product> build(
            Long id, String productName, Long categoryId, Long materialId,
            Integer status, BigDecimal minPrice, BigDecimal maxPrice) {

        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // 1. Lọc theo ID sản phẩm (chính xác)
            if (id != null) {
                predicates.add(cb.equal(root.get("id"), id));
            }

            // 2. Lọc theo Tên sản phẩm (chứa, không phân biệt hoa thường)
            if (productName != null && !productName.isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("productName")), "%" + productName.toLowerCase() + "%"));
            }

            // 3. Lọc theo ID Danh mục (join với bảng 'categories')
            if (categoryId != null) {
                Join<Product, Category> categoryJoin = root.join("categories");
                predicates.add(cb.equal(categoryJoin.get("id"), categoryId));
            }

            // 4. Lọc theo ID Chất liệu (join với bảng 'material')
            if (materialId != null) {
                Join<Product, Material> materialJoin = root.join("material");
                predicates.add(cb.equal(materialJoin.get("id"), materialId));
            }

            // 5. Lọc theo Trạng thái (product_status)
            if (status != null) {
                predicates.add(cb.equal(root.get("productStatus"), status));
            }

            // 6. Lọc theo Giá (minPrice)
            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("minPrice"), minPrice));
            }
            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("minPrice"), maxPrice));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}

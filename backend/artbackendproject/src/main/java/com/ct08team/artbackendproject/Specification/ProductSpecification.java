package com.ct08team.artbackendproject.Specification;


import com.ct08team.artbackendproject.Entity.product.*;
import com.ct08team.artbackendproject.DTO.Filter.ProductFilterRequestDTO;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ProductSpecification {

    public static Specification<Product> build(ProductFilterRequestDTO filter) {
        return (root, query, cb) -> {
            query.distinct(true); // QUAN TRỌNG: Chống trùng lặp
            List<Predicate> predicates = new ArrayList<>();
            Map<String, Join<?, ?>> joins = new HashMap<>();

            // 1. Lọc theo Khoảng giá (minPrice trên bảng product)
            if (filter.getPriceRange() != null) {
                if (filter.getPriceRange().getMinPrice() != null) {
                    predicates.add(cb.greaterThanOrEqualTo(root.get("minPrice"), filter.getPriceRange().getMinPrice()));
                }
                if (filter.getPriceRange().getMaxPrice() != null) {
                    predicates.add(cb.lessThanOrEqualTo(root.get("minPrice"), filter.getPriceRange().getMaxPrice()));
                }
            }

            // 2. Lọc theo Danh mục
            if (filter.getCategories() != null && !filter.getCategories().isEmpty()) {
                Join<Product, Category> join = (Join<Product, Category>) joins
                        .computeIfAbsent("categories", k -> root.join("categories"));
                predicates.add(join.get("id").in(filter.getCategories()));
            }

            // 3. Lọc theo Chất liệu
            if (filter.getMaterials() != null && !filter.getMaterials().isEmpty()) {
                predicates.add(root.get("material").get("id").in(filter.getMaterials()));
            }

            // 4. Lọc theo Kích thước
            if (filter.getDimensions() != null && !filter.getDimensions().isEmpty()) {
                Join<Product, ProductVariant> join = (Join<Product, ProductVariant>) joins
                        .computeIfAbsent("variants", k -> root.join("variants"));
                predicates.add(join.get("id").get("dimensions").in(filter.getDimensions()));
            }

            // 5. Lọc theo Màu sắc
            if (filter.getColors() != null && !filter.getColors().isEmpty()) {
                Join<Product, ProductColor> join = (Join<Product, ProductColor>) joins
                        .computeIfAbsent("colors", k -> root.join("colors"));
                predicates.add(join.get("id").get("hexCode").in(filter.getColors()));
            }

            // 6. Lọc theo Chủ đề
            if (filter.getTopics() != null && !filter.getTopics().isEmpty()) {
                Join<Product, ProductTopic> join = (Join<Product, ProductTopic>) joins
                        .computeIfAbsent("topics", k -> root.join("topics"));
                predicates.add(join.get("id").get("topicName").in(filter.getTopics()));
            }

            if (StringUtils.hasText(filter.getProductName())) {
                predicates.add(cb.like(
                        cb.lower(root.get("productName")), // Giả sử trường trong Entity Product là "productName"
                        "%" + filter.getProductName().toLowerCase() + "%"
                ));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
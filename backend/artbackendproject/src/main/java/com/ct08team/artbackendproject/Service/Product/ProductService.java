package com.ct08team.artbackendproject.Service.Product;


import com.ct08team.artbackendproject.DAO.CategoryRepository;
import com.ct08team.artbackendproject.DTO.ProductListDTO;
import com.ct08team.artbackendproject.Entity.product.Category;
import com.ct08team.artbackendproject.Entity.product.Product;
import com.ct08team.artbackendproject.DTO.Filter.ProductFilterRequestDTO;
import com.ct08team.artbackendproject.DAO.ProductRepository;
import com.ct08team.artbackendproject.Service.Filter.FilterService;
import com.ct08team.artbackendproject.Specification.ProductSpecification;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    // --- Logic danh mục đã được chuyển sang FilterService ---
    @Autowired
    private FilterService filterService; // Injec FilterService

    /**
     * API 3: Lấy danh sách sản phẩm (ĐÃ CẬP NHẬT)
     */
    @Transactional(readOnly = true)
    public Page<ProductListDTO> searchProducts(ProductFilterRequestDTO filter, Pageable pageable) {

        // --- BƯỚC MỚI: GỌI FILTERSERVICE ĐỂ MỞ RỘNG IDS ---
        // Lấy danh sách ID gốc từ DTO (ví dụ: [1])
        List<Long> originalCategoryIds = filter.getCategories();

        // Mở rộng nó (ví dụ: [1, 6, 7, 8, 9]) bằng cách gọi FilterService
        List<Long> expandedCategoryIds = filterService.expandCategoryIds(originalCategoryIds);

        // Đặt lại danh sách đã mở rộng vào DTO
        filter.setCategories(expandedCategoryIds);
        // --- HẾT BƯỚC MỚI ---

        // 1. Xây dựng bộ lọc (WHERE)
        // Specification sẽ nhận DTO đã cập nhật
        Specification<Product> spec = ProductSpecification.build(filter);

        // 2. Tự động áp dụng phân trang VÀ sắp xếp
        Page<Product> productPage = productRepository.findAll(spec, pageable);

        // 3. Chuyển đổi sang DTO để trả về
        return productPage.map(this::convertToProductListDTO);
    }

    /**
     * Hàm helper để chuyển đổi Product Entity sang ProductListDTO.
     * @param product Entity sản phẩm lấy từ DB
     * @return DTO rút gọn để hiển thị danh sách
     */
    private ProductListDTO convertToProductListDTO(Product product) {
        // Hàm này giả định bạn đã có ProductListDTO
        // với constructor (Long id, String productName, String thumbnail, BigDecimal minPrice)
        return new ProductListDTO(
                product.getId(),
                product.getProductName(),
                product.getThumbnail(),
                product.getMinPrice() // Lấy giá đã phi chuẩn hóa
        );
    }
}
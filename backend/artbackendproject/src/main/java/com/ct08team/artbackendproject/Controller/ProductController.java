package com.ct08team.artbackendproject.Controller;

import com.ct08team.artbackendproject.DTO.Filter.ProductFilterRequestDTO;
import com.ct08team.artbackendproject.DTO.ProductDetailDTO;
import com.ct08team.artbackendproject.DTO.ProductListDTO;
import com.ct08team.artbackendproject.Service.Product.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.ct08team.artbackendproject.DAO.ProductVariantRepository;
import com.ct08team.artbackendproject.DTO.ProductVariantDTO;
import com.ct08team.artbackendproject.Entity.product.ProductVariant;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductVariantRepository variantRepository;


    @GetMapping("/search-query")
    public ResponseEntity<List<ProductListDTO>> searchProducts(
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "10") int limit
    ) {
        if (q == null || q.trim().isEmpty()) {
            return ResponseEntity.ok(List.of());
        }
        
        List<ProductListDTO> results = productService.searchProducts(q.trim(), limit);
        return ResponseEntity.ok(results);
    }

    @PostMapping("/search")
    public ResponseEntity<Page<ProductListDTO>> searchProducts(
            @RequestBody ProductFilterRequestDTO filter,
            @PageableDefault(size = 20, sort = "productName") Pageable pageable)
    {
        Page<ProductListDTO> productPage = productService.searchProducts(filter, pageable);
        return ResponseEntity.ok(productPage);
    }

    @GetMapping("/featured")
    public ResponseEntity<?> getFeaturedProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductListDTO> products = productService.getFeaturedProducts(pageable);
        
        Map<String, Object> response = new HashMap<>();
        response.put("content", products.getContent());
        response.put("totalElements", products.getTotalElements());
        response.put("totalPages", products.getTotalPages());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/newest")
    public ResponseEntity<?> getNewestProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        Page<ProductListDTO> products = productService.getNewestProducts(pageable);
        
        Map<String, Object> response = new HashMap<>();
        response.put("content", products.getContent());
        response.put("totalElements", products.getTotalElements());
        response.put("totalPages", products.getTotalPages());
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/by-ids")
    public ResponseEntity<?> getProductsByIds(
            @RequestBody java.util.List<Long> ids,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size)
    {
        
        int limitedSize = Math.min(size, 20);
        Pageable pageable = PageRequest.of(page, limitedSize);
        Page<ProductListDTO> products = productService.getProductsByIds(ids, pageable);
        
        
        Map<String, Object> response = new HashMap<>();
        response.put("content", products.getContent());
        response.put("totalElements", products.getTotalElements());
        response.put("totalPages", products.getTotalPages());
        response.put("currentPage", products.getNumber());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{productId}/variants")
    public ResponseEntity<Page<ProductVariantDTO>> getProductVariants(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size)
    {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductVariant> variantPage = variantRepository.findByProductId(productId, pageable);
        
        if (variantPage.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Page<ProductVariantDTO> dtoPage = variantPage.map(v -> 
            new ProductVariantDTO(
                v.getDimensions(),
                v.getPrice().doubleValue(),
                v.getStockQuantity()
            )
        );
        
        return ResponseEntity.ok(dtoPage);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductDetail(@PathVariable Long id) {
        try {
            ProductDetailDTO dto = productService.getProductDetail(id);
            
            if (dto == null) {
                return ResponseEntity.status(404).body(Map.of(
                    "message", "Product not found",
                    "productId", id
                ));
            }
            
            
            return ResponseEntity.ok(dto);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "message", "Internal server error: " + e.getMessage(),
                "productId", id
            ));
        }
    }


    @GetMapping("/category/{categoryId}")
    public ResponseEntity<?> getProductsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        int limitedSize = Math.min(size, 20);
        Pageable pageable = PageRequest.of(page, limitedSize);
        Page<ProductListDTO> pageDto = productService.getProductsByCategory(categoryId, pageable);
        
        
        Map<String, Object> response = new HashMap<>();
        response.put("content", pageDto.getContent());
        response.put("totalElements", pageDto.getTotalElements());
        response.put("totalPages", pageDto.getTotalPages());
        response.put("currentPage", pageDto.getNumber());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/suggest")
    public ResponseEntity<List<ProductListDTO>> getSearchSuggestions(
            @RequestParam(name = "keyword") String keyword,
            @RequestParam(name = "limit", defaultValue = "5") int limit)
    {
        // 1. Kiểm tra nếu keyword rỗng
        if (keyword == null || keyword.trim().isEmpty()) {
            return ResponseEntity.ok(List.of()); // Trả về danh sách rỗng
        }

        // 2. Giới hạn "limit" để bảo vệ CSDL (ví dụ tối đa 10)
        int effectiveLimit = Math.min(limit, 10);

        // 3. Tạo một Filter DTO
        // Chúng ta sẽ tái sử dụng logic search tuyệt vời
        // mà bạn đã có trong "productService.searchProducts"
        ProductFilterRequestDTO filter = new ProductFilterRequestDTO();

        // **QUAN TRỌNG**: Giả sử ProductFilterRequestDTO của bạn có
        // trường 'productName' để tìm kiếm.
        // Nếu tên trường là 'keyword', hãy đổi thành: filter.setKeyword(keyword);
        filter.setProductName(keyword);

        // 4. Tạo Pageable
        // Chúng ta chỉ cần trang đầu tiên (0), với 'effectiveLimit'
        // Sắp xếp theo 'productName' giống như API search chính
        Pageable pageable = PageRequest.of(0, effectiveLimit, Sort.by("productName"));

        // 5. Gọi service search hiện có
        Page<ProductListDTO> productPage = productService.searchProducts(filter, pageable);

        // 6. Trả về nội dung (content) của Page
        // Đây chính là List<ProductListDTO> mà React cần
        return ResponseEntity.ok(productPage.getContent());
    }
}
package com.ct08team.artbackendproject.Controller;

import com.ct08team.artbackendproject.DTO.ProductAdminDTO;
import com.ct08team.artbackendproject.DTO.ProductCreateDTO;
import com.ct08team.artbackendproject.Service.Product.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize; // (Cần bảo mật)
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * Controller CHỈ DÀNH CHO ADMIN
 * (Các API mà ProductAdmin.jsx gọi)
 * TODO: Thêm @PreAuthorize("hasRole('ADMIN')") cho tất cả các endpoint
 */
@RestController
@RequestMapping("/api/v1/admin/products")
public class ProductAdminController {

    @Autowired
    private ProductService productService;

    /**
     * API 1: Tìm kiếm sản phẩm (cho Admin)
     */
    @GetMapping("/search")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<ProductAdminDTO>> searchProductsAdmin(
            @RequestParam(required = false) Long id,
            @RequestParam(required = false) String productName,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long materialId,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @PageableDefault(size = 10) Pageable pageable) {

        Page<ProductAdminDTO> page = productService.searchProductsAdmin(
                id, productName, categoryId, materialId, status, minPrice, maxPrice, pageable
        );
        return ResponseEntity.ok(page);
    }

    /**
     * API 2: Cập nhật trạng thái (Ẩn/Hiện)
     */
    @PutMapping("/{id}/status")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> toggleProductStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> requestBody) {

        Integer newStatus = requestBody.get("status");
        if (newStatus == null || (newStatus != 0 && newStatus != 1)) {
            return ResponseEntity.badRequest().body("Trạng thái (status) không hợp lệ.");
        }

        productService.toggleProductStatus(id, newStatus);
        return ResponseEntity.ok().build();
    }

    /**
     * API 3: Xóa sản phẩm
     */
    @DeleteMapping("/{id}")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok().build();
    }

    // =======================================================
    // SỬA: API 4: Thêm sản phẩm mới (Dùng @RequestPart)
    // =======================================================
    @PostMapping(consumes = { "multipart/form-data" }) // <-- BẮT BUỘC
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductAdminDTO> createProduct(
            // SỬA: Dùng @RequestPart cho từng phần

            // 1. Phần DTO (JSON)
            @RequestPart("dto") ProductCreateDTO dto,

            // 2. File Thumbnail (có thể không có)
            @RequestPart(name = "thumbnailFile", required = false) MultipartFile thumbnailFile,

            // 3. Danh sách TẤT CẢ các file của phiên bản
            @RequestPart(name = "variantFiles", required = false) List<MultipartFile> variantFiles
    ) {
        try {
            // SỬA: Truyền các part mới vào service
            ProductAdminDTO newProduct = productService.createProduct(dto, thumbnailFile, variantFiles);
            return ResponseEntity.status(HttpStatus.CREATED).body(newProduct);
        } catch (Exception e) {
            e.printStackTrace(); // In lỗi ra console
            // Trả về lỗi chi tiết
            return ResponseEntity.badRequest().body(null); // (Nên trả về DTO lỗi)
        }
    }
    // TODO:
    // API 4: GET /api/v1/admin/products/{id} (Cho trang Edit)
    // API 5: POST /api/v1/admin/products (Cho trang Add New)
    // API 6: PUT /api/v1/admin/products/{id} (Cho trang Edit)
}

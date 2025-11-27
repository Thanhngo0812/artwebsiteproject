package com.ct08team.artbackendproject.Controller;

import com.ct08team.artbackendproject.DTO.ProductSimpleDTO; // <-- IMPORT MỚI
import com.ct08team.artbackendproject.DTO.PromotionListDTO;
import com.ct08team.artbackendproject.Entity.product.Category;
import com.ct08team.artbackendproject.Entity.product.Product;

import com.ct08team.artbackendproject.Entity.promotion.Promotion;
import com.ct08team.artbackendproject.Entity.promotion.PromotionType;
import com.ct08team.artbackendproject.Service.Promotion.PromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/admin/promotions")
public class PromotionAdminController {

    @Autowired
    private PromotionService promotionService;

    // ... (Các API CRUD cũ giữ nguyên) ...
    // 1. Lấy danh sách (SỬA: Trả về DTO)
    @GetMapping
    public ResponseEntity<Page<PromotionListDTO>> getAllPromotions(
            @RequestParam(required = false) String keyword,
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        // Gọi service lấy Page<Promotion> rồi map sang DTO
        Page<Promotion> pageEntity = promotionService.findAll(keyword, pageable);
        Page<PromotionListDTO> pageDTO = pageEntity.map(PromotionListDTO::new);
        return ResponseEntity.ok(pageDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Promotion> getPromotionById(@PathVariable Long id) {
        return ResponseEntity.ok(promotionService.findById(id));
    }

    // 3. Tạo mới
    @PostMapping
    public ResponseEntity<?> createPromotion(@RequestBody Promotion promotion) {
        if(Objects.equals(promotion.getCode(), "")){
            promotion.setCode(null);
        }
        if(Objects.equals(promotion.getMinOrderValue(), null)){
            promotion.setMinOrderValue(BigDecimal.valueOf(0));
        }
        if(promotion.getType()== PromotionType.FIXED_AMOUNT){
            promotion.setMaxDiscountValue(promotion.getValue());
        }
        try {
            Promotion newPromo = promotionService.create(promotion);
            // SỬA: Trả về DTO thay vì Entity
            return ResponseEntity.ok(new PromotionListDTO(newPromo));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // 4. Cập nhật
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePromotion(@PathVariable Long id, @RequestBody Promotion promotion) {
        if(Objects.equals(promotion.getCode(), "")){
            promotion.setCode(null);
        }
        if(Objects.equals(promotion.getMinOrderValue(), null)){

            promotion.setMinOrderValue(BigDecimal.valueOf(0));
        }
        if(promotion.getType()== PromotionType.FIXED_AMOUNT){
            promotion.setMaxDiscountValue(promotion.getValue());
        }
        try {
            Promotion updatedPromo = promotionService.update(id, promotion);
            // SỬA: Trả về DTO thay vì Entity để tránh lỗi ByteBuddy
            return ResponseEntity.ok(new PromotionListDTO(updatedPromo));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePromotion(@PathVariable Long id) {
        try {
            promotionService.delete(id);
            return ResponseEntity.ok(Map.of("message", "Xóa thành công"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // --- API SẢN PHẨM ---

    @GetMapping("/{id}/products")
    // SỬA: Trả về List<ProductSimpleDTO>
    public ResponseEntity<List<ProductSimpleDTO>> getProducts(@PathVariable Long id) {
        return ResponseEntity.ok(promotionService.getProductsByPromotion(id));
    }

    @PostMapping("/{id}/products/{productId}")
    public ResponseEntity<?> addProduct(@PathVariable Long id, @PathVariable Long productId) {
        try {
            promotionService.addProductToPromotion(id, productId);
            return ResponseEntity.ok(Map.of("message", "Đã thêm sản phẩm vào khuyến mãi"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}/products/{productId}")
    public ResponseEntity<?> removeProduct(@PathVariable Long id, @PathVariable Long productId) {
        try {
            promotionService.removeProductFromPromotion(id, productId);
            return ResponseEntity.ok(Map.of("message", "Đã xóa sản phẩm khỏi khuyến mãi"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // --- API DANH MỤC ---

    @GetMapping("/{id}/categories")
    public ResponseEntity<Set<Category>> getCategories(@PathVariable Long id) {
        return ResponseEntity.ok(promotionService.getCategoriesByPromotion(id));
    }

    @PostMapping("/{id}/categories/{catId}")
    public ResponseEntity<?> addCategory(@PathVariable Long id, @PathVariable Long catId) {
        try {
            promotionService.addCategoryToPromotion(id, catId);
            return ResponseEntity.ok(Map.of("message", "Đã thêm danh mục"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}/categories/{catId}")
    public ResponseEntity<?> removeCategory(@PathVariable Long id, @PathVariable Long catId) {
        try {
            promotionService.removeCategoryFromPromotion(id, catId);
            return ResponseEntity.ok(Map.of("message", "Đã xóa danh mục"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
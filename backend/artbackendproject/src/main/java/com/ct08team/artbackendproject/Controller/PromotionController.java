package com.ct08team.artbackendproject.Controller;



import com.ct08team.artbackendproject.DTO.Promotion.PromotionDTO;
import com.ct08team.artbackendproject.Service.Promotion.PromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller xử lý các hoạt động liên quan đến Khuyến mãi
 * (Bao gồm cả 'Sale' tự động và 'Coupon')
 */
@RestController
@RequestMapping("/api/v1/promotions")
public class PromotionController {

    @Autowired
    private PromotionService promotionService;

    /**
     * API 1: Áp dụng mã Coupon
     * (React: handleApplyCoupon)
     */
    @PostMapping("/apply")
    public ResponseEntity<?> applyCoupon(@RequestBody PromotionDTO.ApplyRequest request) {
        try {
            // Service sẽ kiểm tra và tính toán
            PromotionDTO.ApplyResponse response = promotionService.applyCoupon(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // Bắt các lỗi (ví dụ: "Mã hết hạn", "Không tồn tại")
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // (Bạn có thể thêm các API Admin CRUD (Tạo/Sửa/Xóa) cho khuyến mãi ở đây)
}

package com.ct08team.artbackendproject.Controller;

import com.ct08team.artbackendproject.DTO.OrderHistoryDTO;
import com.ct08team.artbackendproject.DTO.PageResponse; // (Dùng lại DTO phân trang)
import com.ct08team.artbackendproject.Service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/orders")
public class OrderAdminController {

    @Autowired
    private OrderService orderService;

    /**
     * API: Lấy danh sách đơn hàng (Admin)
     * GET /api/v1/admin/orders?status=PENDING&keyword=0909...
     */
    @GetMapping
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PageResponse<OrderHistoryDTO>> getOrders(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<OrderHistoryDTO> page = orderService.getOrdersForAdmin(status, keyword, startDate, endDate, pageable);
        return ResponseEntity.ok(new PageResponse<>(page));
    }

    /**
     * API: Cập nhật trạng thái đơn hàng
     * PUT /api/v1/admin/orders/{id}/status
     * Body: { "status": "APPROVED" }
     */
    @PutMapping("/{id}/status")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        try {
            String newStatus = body.get("status");
            if (newStatus == null) throw new RuntimeException("Thiếu trạng thái mới.");

            orderService.updateOrderStatus(id, newStatus);
            return ResponseEntity.ok(Map.of("message", "Cập nhật trạng thái thành công: " + newStatus));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
package com.ct08team.artbackendproject.Controller;



import com.ct08team.artbackendproject.DTO.OrderDTO;
import com.ct08team.artbackendproject.DTO.OrderHistoryDTO;
import com.ct08team.artbackendproject.DTO.PageResponse;
import com.ct08team.artbackendproject.DTO.PaymentResponseDTO; // Dùng DTO đơn giản này
import com.ct08team.artbackendproject.Entity.Order;
import com.ct08team.artbackendproject.Service.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createOrder(
            @RequestBody OrderDTO orderDTO,
            Principal principal,
            HttpServletRequest request
    ) {
        try {
            String username = principal.getName();

            // SỬA: Nhận về PaymentResponseDTO (không phải SepayDTO)
            PaymentResponseDTO response = orderService.createOrder(orderDTO, username, request);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<PageResponse<OrderHistoryDTO>> getMyOrders(
            Principal principal,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @PageableDefault(size = 10, sort = "createdAt", direction = org.springframework.data.domain.Sort.Direction.DESC) Pageable pageable
    ) {
        // Gọi Service (đã trả về Page<OrderHistoryDTO>)
        Page<OrderHistoryDTO> page = orderService.getUserOrders(principal.getName(), startDate, endDate, pageable);

        // Wrap vào PageResponse để có cấu trúc JSON chuẩn (content, totalPages)
        return ResponseEntity.ok(new PageResponse<>(page));
    }


    // =======================================================
    // SỬA: VNPAY Callback
    // =======================================================
    @GetMapping("/vnpay-callback") // Đổi từ sepay -> vnpay
    public ResponseEntity<String> handleVnpayCallback(HttpServletRequest request) {
        // (Logic xác thực checksum VNPAY sẽ ở đây)
        System.out.println("--- VNPAY CALLBACK RECEIVED ---");

        // VNPAY cần trả về JSON cụ thể này nếu thành công
        return ResponseEntity.ok("{\"RspCode\":\"00\",\"Message\":\"Confirm Success\"}");
    }

    @PutMapping("/{orderId}/cancel-by-user")
    @PreAuthorize("hasRole('USER')") // Chỉ user mới được gọi
    public ResponseEntity<?> cancelOrderByUser(
            @PathVariable Long orderId,
            Principal principal
    ) {
        try {
            // Gọi service với username hiện tại (để kiểm tra quyền sở hữu)
            orderService.cancelOrderByUser(orderId, principal.getName());
            return ResponseEntity.ok(Map.of("message", "Đã hủy đơn hàng thành công."));
        } catch (Exception e) {
            // Trả về lỗi (bao gồm cả thông báo "liên hệ 0909...")
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
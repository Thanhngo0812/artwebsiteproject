package com.ct08team.artbackendproject.Controller;



import com.ct08team.artbackendproject.DTO.OrderDTO;
import com.ct08team.artbackendproject.DTO.PaymentResponseDTO; // Dùng DTO đơn giản này
import com.ct08team.artbackendproject.Service.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
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
}
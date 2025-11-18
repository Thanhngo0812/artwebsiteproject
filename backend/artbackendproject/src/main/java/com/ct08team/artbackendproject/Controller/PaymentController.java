package com.ct08team.artbackendproject.Controller;

import com.ct08team.artbackendproject.DAO.OrderRepository;
import com.ct08team.artbackendproject.Entity.Order;
import com.ct08team.artbackendproject.Service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api")
public class PaymentController {
    @Autowired
    private OrderService orderService;
    @PutMapping("/orders/{orderId}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable String orderId) {
        Order order = orderService.getOrderById(Long.valueOf(orderId));
        if (order == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found");

        order.setOrderStatus("CANCELLED");
        order.setPaymentStatus("FAILED");
        orderService.save(order);

        return ResponseEntity.ok(Map.of("message", "Đã hủy đơn hàng", "order", order));
    }

    // 2. API Xác nhận thanh toán thành công (PUT /api/orders/{orderId}/confirm)
    // -> Chuyển Status: PAID, Payment: SUCCESSFUL
    @PutMapping("/orders/{orderId}/confirm")
    public ResponseEntity<?> confirmOrderPayment(@PathVariable String orderId) {
        Order order = orderService.getOrderById(Long.valueOf(orderId));
        if (order == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found");

        order.setOrderStatus("PAID");
        order.setPaymentStatus("SUCCESSFUL");
        orderService.save(order);
        return ResponseEntity.ok(Map.of("message", "Xác nhận thanh toán thành công", "order", order));
    }

}
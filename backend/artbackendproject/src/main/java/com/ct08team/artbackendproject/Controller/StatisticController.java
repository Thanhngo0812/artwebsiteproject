package com.ct08team.artbackendproject.Controller;

import com.ct08team.artbackendproject.Service.Dashboard.StatisticService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/statistics")
public class StatisticController {

    @Autowired
    private StatisticService statisticService;

    // 1. Top Products
    @GetMapping("/products/top")
    public ResponseEntity<?> getTopProducts(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "10") int limit
    ) {
        return ResponseEntity.ok(statisticService.getTopProducts(startDate, endDate, limit));
    }

    // 1.1 Orders by Product
    @GetMapping("/products/{id}/orders")
    public ResponseEntity<?> getOrdersByProduct(
            @PathVariable Long id,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        return ResponseEntity.ok(statisticService.getOrdersByProduct(id, startDate, endDate));
    }

    // 2. Top Users
    @GetMapping("/users/top")
    public ResponseEntity<?> getTopUsers(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "10") int limit
    ) {
        return ResponseEntity.ok(statisticService.getTopUsers(startDate, endDate, limit));
    }

    // 2.1 Orders by User
    @GetMapping("/users/{id}/orders")
    public ResponseEntity<?> getOrdersByUser(
            @PathVariable Long id,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        return ResponseEntity.ok(statisticService.getOrdersByUser(id, startDate, endDate));
    }

    // 3. Revenue Orders
    @GetMapping("/revenue/orders")
    public ResponseEntity<?> getRevenueOrders(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        return ResponseEntity.ok(statisticService.getRevenueOrders(startDate, endDate));
    }
}
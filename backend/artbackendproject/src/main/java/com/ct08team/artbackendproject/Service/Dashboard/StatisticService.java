package com.ct08team.artbackendproject.Service.Dashboard;


import com.ct08team.artbackendproject.DAO.OrderRepository;
import com.ct08team.artbackendproject.DTO.Dashboard.TopProductStatDTO;
import com.ct08team.artbackendproject.DTO.Dashboard.TopUserStatDTO;
import com.ct08team.artbackendproject.DTO.OrderHistoryDTO;
import com.ct08team.artbackendproject.Entity.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StatisticService {

    @Autowired
    private OrderRepository orderRepository;

    private Instant getStartOfDay(LocalDate date) {
        return date != null ? date.atStartOfDay(ZoneId.systemDefault()).toInstant() : null;
    }
    private Instant getEndOfDay(LocalDate date) {
        return date != null ? date.atTime(23, 59, 59).atZone(ZoneId.systemDefault()).toInstant() : null;
    }

    // 1. Top Products
    public List<TopProductStatDTO> getTopProducts(LocalDate from, LocalDate to, int limit) {
        return orderRepository.findTopProducts(getStartOfDay(from), getEndOfDay(to), PageRequest.of(0, limit));
    }

    public List<OrderHistoryDTO> getOrdersByProduct(Long productId, LocalDate from, LocalDate to) {
        List<Order> orders = orderRepository.findOrdersByProductAndDate(productId, getStartOfDay(from), getEndOfDay(to));
        return orders.stream().map(OrderHistoryDTO::new).collect(Collectors.toList());
    }

    // 2. Top Users
    public List<TopUserStatDTO> getTopUsers(LocalDate from, LocalDate to, int limit) {
        return orderRepository.findTopUsers(getStartOfDay(from), getEndOfDay(to), PageRequest.of(0, limit));
    }

    public List<OrderHistoryDTO> getOrdersByUser(Long userId, LocalDate from, LocalDate to) {
        List<Order> orders = orderRepository.findOrdersByUserAndDate(userId, getStartOfDay(from), getEndOfDay(to));
        return orders.stream().map(OrderHistoryDTO::new).collect(Collectors.toList());
    }

    // 3. Revenue (Lấy list đơn hàng để vẽ biểu đồ hoặc hiện bảng)
    public List<OrderHistoryDTO> getRevenueOrders(LocalDate from, LocalDate to) {
        List<Order> orders = orderRepository.findOrdersByDateRange(getStartOfDay(from), getEndOfDay(to));
        return orders.stream().map(OrderHistoryDTO::new).collect(Collectors.toList());
    }
}
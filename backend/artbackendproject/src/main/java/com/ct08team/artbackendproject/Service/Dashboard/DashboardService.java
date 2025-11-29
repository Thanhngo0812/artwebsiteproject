package com.ct08team.artbackendproject.Service.Dashboard;


import com.ct08team.artbackendproject.DAO.Auth.UserRepository;

import com.ct08team.artbackendproject.DAO.OrderRepository;
import com.ct08team.artbackendproject.DAO.ProductRepository;
import com.ct08team.artbackendproject.DTO.Dashboard.DashboardDTO;
import com.ct08team.artbackendproject.DTO.OrderHistoryDTO;
import com.ct08team.artbackendproject.Entity.Order;
import com.ct08team.artbackendproject.Entity.product.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired private OrderRepository orderRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private UserRepository userRepository;

    public DashboardDTO getDashboardStats() {
        DashboardDTO dto = new DashboardDTO();

        // 1. Tổng quan
        dto.setTotalOrders(orderRepository.count());
        dto.setTotalUsers(userRepository.count());

        // Sản phẩm sắp hết hàng (ví dụ: < 10).
        // Cần thêm method: countByStockQuantityLessThan(int quantity) trong ProductRepository
        // Hoặc đếm thủ công (không khuyến khích với DB lớn):
         long lowStock = productRepository.findAll().stream()
                 .filter(p -> p.getVariants().stream().anyMatch(v -> v.getStockQuantity() < 5))
                 .count();
        // Tạm thời giả định có phương thức repo hoặc đếm đơn giản:
        dto.setLowStockProducts(0L); // TODO: Implement repo method countLowStock()

        // Tổng doanh thu (Chỉ tính các đơn đã thanh toán: PAID hoặc DELIVERED)
        // Cần method: sumTotalPriceByStatusIn(List<String> statuses)
        // Tạm thời tính thủ công từ list all (Demo):
        List<Order> paidOrders = orderRepository.findAll().stream()
                .filter(o -> "PAID".equals(o.getOrderStatus()) || "DELIVERED".equals(o.getOrderStatus()))
                .collect(Collectors.toList());
        BigDecimal revenue = paidOrders.stream()
                .map(Order::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        dto.setTotalRevenue(revenue);


        // 2. Biểu đồ trạng thái đơn hàng (Đếm thực tế)
        Map<String, Long> statusCounts = new HashMap<>();
        statusCounts.put("PENDING", orderRepository.countByOrderStatus("PENDING"));
        statusCounts.put("PAID", orderRepository.countByOrderStatus("PAID"));
        statusCounts.put("CANCELLED", orderRepository.countByOrderStatus("CANCELLED"));
        statusCounts.put("SHIPPED", orderRepository.countByOrderStatus("SHIPPED"));
        statusCounts.put("DELIVERED", orderRepository.countByOrderStatus("DELIVERED"));
        dto.setOrderStatusCounts(statusCounts);

        // 3. Đơn hàng mới nhất (Lấy 5 đơn)
        List<Order> recentOrders = orderRepository.findAll(
                PageRequest.of(0, 5, Sort.by("createdAt").descending())
        ).getContent();
        dto.setRecentOrders(recentOrders.stream().map(OrderHistoryDTO::new).collect(Collectors.toList()));

        // 4. Biểu đồ doanh thu (7 ngày gần nhất) - Tính TOÁN THẬT
        List<DashboardDTO.RevenueChartData> chartData = new ArrayList<>();
        LocalDate today = LocalDate.now();

        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            // Tạo khoảng thời gian từ đầu ngày đến cuối ngày
            LocalDateTime startOfDay = date.atStartOfDay();
            LocalDateTime endOfDay = date.atTime(23, 59, 59);

            // Query DB: Lấy các đơn PAID/DELIVERED trong khoảng này
            // Cần repo: findByCreatedAtBetweenAndOrderStatusIn(...)
            // Demo logic java:
            BigDecimal dailyRevenue = orderRepository.findAll().stream()
                    .filter(o -> {
                        LocalDateTime created = LocalDateTime.ofInstant(o.getCreatedAt(), ZoneId.systemDefault());
                        return !created.isBefore(startOfDay) && !created.isAfter(endOfDay) &&
                                ("PAID".equals(o.getOrderStatus()) || "DELIVERED".equals(o.getOrderStatus()));
                    })
                    .map(Order::getTotalPrice)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            chartData.add(createChartData(date.toString(), dailyRevenue));
        }
        dto.setRevenueChart(chartData);

        // 5. Top sản phẩm bán chạy (Optional - Cần query phức tạp hơn)
        // dto.setTopProducts(...);

        return dto;
    }

    private DashboardDTO.RevenueChartData createChartData(String date, BigDecimal val) {
        DashboardDTO.RevenueChartData d = new DashboardDTO.RevenueChartData();
        d.setDate(date);
        d.setRevenue(val);
        return d;
    }
}
package com.ct08team.artbackendproject.DTO.Dashboard;
import com.ct08team.artbackendproject.DTO.OrderHistoryDTO;
import com.ct08team.artbackendproject.Entity.Order;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
public class DashboardDTO {
    // Tổng quan
    private BigDecimal totalRevenue; // Tổng doanh thu
    private Long totalOrders;        // Tổng số đơn
    private Long totalUsers;         // Tổng khách hàng
    private Long lowStockProducts;   // SP sắp hết hàng

    // Biểu đồ doanh thu (ví dụ: theo ngày trong tháng này)
    private List<RevenueChartData> revenueChart;

    // Biểu đồ trạng thái đơn hàng (Số lượng theo từng status)
    private Map<String, Long> orderStatusCounts;

    // Top sản phẩm bán chạy
    private List<TopProductDTO> topProducts;

    // Đơn hàng mới nhất
    private List<OrderHistoryDTO> recentOrders; // Tái sử dụng DTO Order cũ

    @Data
    public static class RevenueChartData {
        private String date; // "2023-11-01"
        private BigDecimal revenue;
    }

    @Data
    public static class TopProductDTO {
        private Long id;
        private String name;
        private String thumbnail;
        private Long soldCount;
    }
}
package com.ct08team.artbackendproject.DAO;

import com.ct08team.artbackendproject.DTO.Dashboard.TopProductStatDTO;
import com.ct08team.artbackendproject.DTO.Dashboard.TopUserStatDTO;
import com.ct08team.artbackendproject.Entity.Order;
import com.ct08team.artbackendproject.Entity.auth.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    // (Spring Data JPA tự động cung cấp save(), findById(), v.v.)

    @Query("SELECT o FROM Order o WHERE " +
            "(:status IS NULL OR o.orderStatus = :status) " +
            "AND (:keyword IS NULL OR o.customerName LIKE %:keyword% OR o.customerPhone LIKE %:keyword% OR CAST(o.id AS string) LIKE %:keyword%) " +
            "AND (:startDate IS NULL OR o.createdAt >= :startDate) " +
            "AND (:endDate IS NULL OR o.createdAt <= :endDate) " +
            "ORDER BY o.createdAt DESC")
    Page<Order> searchOrdersAdmin(
            @Param("status") String status,
            @Param("keyword") String keyword,
            @Param("startDate") Instant startDate,
            @Param("endDate") Instant endDate,
            Pageable pageable);

    // 2. Lấy lịch sử đơn hàng của User
    @Query("SELECT o FROM Order o WHERE o.user = :user " +
            "AND (:startDate IS NULL OR o.createdAt >= :startDate) " +
            "AND (:endDate IS NULL OR o.createdAt <= :endDate) " +
            "ORDER BY o.createdAt DESC")
    Page<Order> findByUserAndDateRange(
            @Param("user") User user,
            @Param("startDate") Instant startDate,
            @Param("endDate") Instant endDate,
            Pageable pageable);

    // 3. Đếm số lượng đơn hàng theo trạng thái (Dùng cho Dashboard)
    long countByOrderStatus(String orderStatus);

    // 4. Tính tổng doanh thu theo khoảng thời gian (Chỉ tính đơn thành công)
    // (Giả sử trạng thái thành công là 'PAID' hoặc 'DELIVERED')
    @Query("SELECT SUM(o.totalPrice) FROM Order o " +
            "WHERE o.orderStatus IN ('PAID', 'DELIVERED') " +
            "AND o.createdAt BETWEEN :startDate AND :endDate")
    BigDecimal calculateRevenue(
            @Param("startDate") Instant startDate,
            @Param("endDate") Instant endDate);

    // 5. Lấy danh sách đơn hàng mới nhất (Dùng cho Dashboard)
    List<Order> findTop5ByOrderByCreatedAtDesc();

    // 1. Thống kê Top Sản phẩm bán chạy
    @Query("SELECT new com.ct08team.artbackendproject.DTO.Dashboard.TopProductStatDTO(" +
            "p.id, p.productName, p.thumbnail, SUM(oi.quantity), SUM(oi.priceAtPurchase * oi.quantity)) " +
            "FROM Order o " +
            "JOIN o.orderItems oi " +
            "JOIN oi.variant v " +
            "JOIN v.product p " +
            "WHERE o.orderStatus = 'PAID' OR o.orderStatus = 'DELIVERED' " +
            "AND (:startDate IS NULL OR o.createdAt >= :startDate) " +
            "AND (:endDate IS NULL OR o.createdAt <= :endDate) " +
            "GROUP BY p.id, p.productName, p.thumbnail " +
            "ORDER BY SUM(oi.quantity) DESC")
    List<TopProductStatDTO> findTopProducts(
            @Param("startDate") Instant startDate,
            @Param("endDate") Instant endDate,
            Pageable pageable);

    // 2. Lấy danh sách đơn hàng chứa sản phẩm X (khi click vào sản phẩm)
    @Query("SELECT DISTINCT o FROM Order o " +
            "JOIN o.orderItems oi " +
            "JOIN oi.variant v " +
            "WHERE v.product.id = :productId " +
            "AND (o.orderStatus = 'PAID' OR o.orderStatus = 'DELIVERED') " +
            "AND (:startDate IS NULL OR o.createdAt >= :startDate) " +
            "AND (:endDate IS NULL OR o.createdAt <= :endDate) " +
            "ORDER BY o.createdAt DESC")
    List<Order> findOrdersByProductAndDate(
            @Param("productId") Long productId,
            @Param("startDate") Instant startDate,
            @Param("endDate") Instant endDate);


    // 3. Thống kê Top Khách hàng
    @Query("SELECT new com.ct08team.artbackendproject.DTO.Dashboard.TopUserStatDTO(" +
            "u.id, u.username, u.email, u.fullName, COUNT(o), SUM(o.totalPrice)) " +
            "FROM Order o " +
            "JOIN o.user u " +
            "WHERE o.orderStatus = 'PAID' OR o.orderStatus = 'DELIVERED' " +
            "AND (:startDate IS NULL OR o.createdAt >= :startDate) " +
            "AND (:endDate IS NULL OR o.createdAt <= :endDate) " +
            "GROUP BY u.id, u.username, u.email, u.fullName " +
            "ORDER BY SUM(o.totalPrice) DESC")
    List<TopUserStatDTO> findTopUsers(
            @Param("startDate") Instant startDate,
            @Param("endDate") Instant endDate,
            Pageable pageable);

    // 4. Lấy danh sách đơn hàng của User X (khi click vào user)
    @Query("SELECT o FROM Order o " +
            "WHERE o.user.id = :userId " +
            "AND (o.orderStatus = 'PAID' OR o.orderStatus = 'DELIVERED') " +
            "AND (:startDate IS NULL OR o.createdAt >= :startDate) " +
            "AND (:endDate IS NULL OR o.createdAt <= :endDate) " +
            "ORDER BY o.createdAt DESC")
    List<Order> findOrdersByUserAndDate(
            @Param("userId") Long userId,
            @Param("startDate") Instant startDate,
            @Param("endDate") Instant endDate);

    // 5. Lấy danh sách đơn hàng theo thời gian (cho tab Doanh thu)
    @Query("SELECT o FROM Order o " +
            "WHERE (o.orderStatus = 'PAID' OR o.orderStatus = 'DELIVERED') " +
            "AND (:startDate IS NULL OR o.createdAt >= :startDate) " +
            "AND (:endDate IS NULL OR o.createdAt <= :endDate) " +
            "ORDER BY o.createdAt DESC")
    List<Order> findOrdersByDateRange(
            @Param("startDate") Instant startDate,
            @Param("endDate") Instant endDate);
}

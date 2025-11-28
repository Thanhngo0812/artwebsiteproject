package com.ct08team.artbackendproject.DAO;

import com.ct08team.artbackendproject.Entity.Order;
import com.ct08team.artbackendproject.Entity.auth.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    // (Spring Data JPA tự động cung cấp save(), findById(), v.v.)

    // Tìm kiếm cho Admin (Lọc nhiều tiêu chí)
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

    // Tìm đơn hàng của User, có lọc theo ngày tạo (Optional)
    // Dùng Query để xử lý logic "nếu ngày null thì lấy hết"
    @Query("SELECT o FROM Order o WHERE o.user = :user " +
            "AND (:startDate IS NULL OR o.createdAt >= :startDate) " +
            "AND (:endDate IS NULL OR o.createdAt <= :endDate) " +
            "ORDER BY o.createdAt DESC")
    Page<Order> findByUserAndDateRange(
            @Param("user") User user,
            @Param("startDate") Instant startDate,
            @Param("endDate") Instant endDate,
            Pageable pageable);
}
package com.ct08team.artbackendproject.Entity.auth;

import com.ct08team.artbackendproject.Entity.auth.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "addresses")
@Data // Sử dụng Lombok (giống như file User.java của bạn)
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // --- Liên kết Many-to-One ---
    // Một User có thể có nhiều Address
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore // Quan trọng: Tránh vòng lặp vô hạn khi serialize JSON
    private User user;

    // --- Các trường dữ liệu (Khớp với CSDL) ---

    @Column(name = "address_name", nullable = false)
    private String addressName;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String address;

    @Column(precision = 10, scale = 8) // Khớp với DECIMAL(10, 8)
    private BigDecimal latitude;

    @Column(precision = 11, scale = 8) // Khớp với DECIMAL(11, 8)
    private BigDecimal longitude;

    // Đây là trường "cái trỏ" (mặc định) bạn đã thêm
    @Column(name = "is_default", nullable = false)
    private boolean isDefault = false;

    // --- Dấu thời gian ---

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    // Constructors (Lombok @Data đã xử lý, nhưng thêm 1 constructor trống
    // là một thói quen tốt cho JPA)
    public Address() {
    }
}

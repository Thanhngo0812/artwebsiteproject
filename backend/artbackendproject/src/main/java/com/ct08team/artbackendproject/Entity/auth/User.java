package com.ct08team.artbackendproject.Entity.auth;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;
import java.util.Set;

@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Thông tin xác thực
    @Column(unique = true, nullable = false)
    private String username;
    @Column(unique = true, nullable = false)
    private String email;
    @Column(nullable = false)
    private String password;

    // Thông tin hồ sơ (có thể null)
    private String fullName;
    private String phoneNumber;

    // Cột Spring Security
    private boolean enabled = true;
    private boolean accountNonLocked = true;

    // --- CÁC CỘT MỚI THÊM CHO 2FA ---
    @Column(name = "otp")
    private String otp;

    @Column(name = "otp_requested_time")
    private Instant otpRequestedTime;
    // --- KẾT THÚC CỘT MỚI ---

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles;

    // Constructors, Getters, Setters (Lombok @Data đã xử lý)
    // Bạn cũng cần tạo Entity Role.java
}

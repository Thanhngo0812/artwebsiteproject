package com.ct08team.artbackendproject.config;

import com.ct08team.artbackendproject.DAO.Auth.RoleRepository;
import com.ct08team.artbackendproject.DAO.Auth.UserRepository;
import com.ct08team.artbackendproject.Entity.auth.Role;
import com.ct08team.artbackendproject.Entity.auth.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Optional;
import java.util.Set;

/**
 * File này tự động chạy khi khởi động ứng dụng.
 * Nó đảm bảo rằng user 'ngocongthanhsg0812' tồn tại
 * và có mật khẩu được mã hóa BCrypt chính xác.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository; // File này giả định bạn đã có RoleRepository

    @Autowired
    private PasswordEncoder passwordEncoder; // Bean BCryptPasswordEncoder từ SecurityConfig

    @Override
    public void run(String... args) throws Exception {
        // --- Chi tiết user bạn muốn ---
        String username = "ngocongthanhsg0812";
        String email = "ngocongthanhsg0812@gmail.com";
        String plainPassword = "password123";
        String roleName = "ROLE_USER"; // Đảm bảo role này tồn tại

        // 1. Tìm hoặc tạo Role (ví dụ: ROLE_USER)
        Role userRole = roleRepository.findByName(roleName)
                .orElseGet(() -> {
                    System.out.println(">>> Đang tạo Role: " + roleName);
                    Role newRole = new Role(); // Giả định bạn có constructor/setter
                    newRole.setName(roleName);
                    return roleRepository.save(newRole);
                });

        // 2. Tìm User bằng username hoặc email
        Optional<User> userOpt = userRepository.findByUsernameOrEmail(username, email);

        if (userOpt.isEmpty()) {
            // --- TRƯỜNG HỢP 1: User CHƯA TỒN TẠI -> Tạo mới "hoàn hảo" ---
            System.out.println(">>> Không tìm thấy user, đang tạo user mới: " + username);

            User newUser = new User();
            newUser.setUsername(username);
            newUser.setEmail(email);

            // === ĐIỀU QUAN TRỌNG NHẤT ===
            // Mã hóa mật khẩu trước khi lưu
            newUser.setPassword(passwordEncoder.encode(plainPassword));
            // ===========================

            newUser.setRoles(Set.of(userRole));
            newUser.setEnabled(true); // Kích hoạt tài khoản
            newUser.setAccountNonLocked(true); // Không khóa tài khoản

            // (Set các trường bắt buộc khác nếu có)

            userRepository.save(newUser);
            System.out.println(">>> ĐÃ TẠO USER MỚI (HOÀN HẢO) THÀNH CÔNG: " + username);

        } else {
            // --- TRƯỜNG HỢP 2: User ĐÃ TỒN TẠI -> Kiểm tra và sửa lỗi mật khẩu ---
            User existingUser = userOpt.get();
            System.out.println(">>> Đã tìm thấy user: " + username);

            // Kiểm tra xem mật khẩu có bị lưu sai (dạng chữ thường) không
            // Chúng ta dùng 'matches' để kiểm tra, nếu 'matches' trả về false
            // VÀ mật khẩu trong DB *không* phải là hash, thì ta sửa nó.
            if (!passwordEncoder.matches(plainPassword, existingUser.getPassword()) &&
                    !existingUser.getPassword().startsWith("$2a$")) {

                System.out.println(">>> PHÁT HIỆN MẬT KHẨU SAI (CHỮ THƯỜNG)! Đang sửa...");

                // Sửa lại mật khẩu cho đúng
                existingUser.setPassword(passwordEncoder.encode(plainPassword));
                userRepository.save(existingUser);

                System.out.println(">>> ĐÃ SỬA MẬT KHẨU (BCRYPT) CHO USER: " + username);

            } else {
                System.out.println(">>> User '" + username + "' đã tồn tại và mật khẩu đã đúng.");
            }

            // Đảm bảo user có role
            if (!existingUser.getRoles().contains(userRole)) {
                existingUser.getRoles().add(userRole);
                userRepository.save(existingUser);
                System.out.println(">>> Đã thêm role " + roleName + " cho user: " + username);
            }
        }
    }
}

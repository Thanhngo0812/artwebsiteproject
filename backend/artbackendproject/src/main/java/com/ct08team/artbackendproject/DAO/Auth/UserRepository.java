package com.ct08team.artbackendproject.DAO.Auth;


import com.ct08team.artbackendproject.Entity.auth.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByUsernameOrEmail(String username, String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
    // =======================================================
    // MỚI: Thêm hàm tìm user bằng email
    // =======================================================
    Optional<User> findByEmail(String email);

    // =======================================================
    // MỚI: Thêm hàm để xóa user theo điều kiện
    // (Xóa các user có enabled=false VÀ thời gian tạo OTP
    //  là "trước" một thời điểm cutoff nào đó)
    // =======================================================
    void deleteByEnabledFalseAndOtpRequestedTimeBefore(Instant cutoffTime);
}

package com.ct08team.artbackendproject.DAO.Auth;

import com.ct08team.artbackendproject.Entity.auth.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    // Tạm thời chưa cần method custom, JpaRepository đã đủ dùng
    // Nếu bạn cần tìm Role theo tên (ví dụ 'ROLE_USER'), bạn có thể thêm:
     Optional<Role> findByName(String name);
}

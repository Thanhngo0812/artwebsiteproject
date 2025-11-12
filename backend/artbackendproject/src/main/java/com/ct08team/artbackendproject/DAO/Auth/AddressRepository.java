package com.ct08team.artbackendproject.DAO.Auth;

import com.ct08team.artbackendproject.Entity.auth.User;
import com.ct08team.artbackendproject.Entity.auth.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {

    /**
     * Tìm tất cả địa chỉ của một User
     */
    List<Address> findByUser(User user);

    /**
     * Tìm một địa chỉ cụ thể bằng ID VÀ User (để bảo mật)
     */
    Optional<Address> findByIdAndUser(Long id, User user);
}
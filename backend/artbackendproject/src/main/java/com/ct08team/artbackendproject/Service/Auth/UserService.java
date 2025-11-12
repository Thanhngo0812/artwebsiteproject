package com.ct08team.artbackendproject.Service.Auth;



import com.ct08team.artbackendproject.DAO.Auth.UserRepository;
import com.ct08team.artbackendproject.DTO.Auth.UserDtos;
import com.ct08team.artbackendproject.Entity.auth.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service // <-- Đổi từ interface thành @Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    /**
     * Helper (nội bộ): Lấy User Entity bằng username
     */
    @Transactional(readOnly = true) // 'readOnly' tối ưu hóa cho việc chỉ đọc
    public User findUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng: " + username));
    }

    /**
     * Lấy thông tin hồ sơ của người dùng hiện tại bằng username (từ token)
     */
    @Transactional(readOnly = true)
    public UserDtos.UserProfileDTO getUserProfile(String username) {
        User user = findUserByUsername(username);
        return UserDtos.UserProfileDTO.fromEntity(user);
    }

    /**
     * Cập nhật thông tin hồ sơ (chỉ fullName và phoneNumber)
     */
    @Transactional // (readOnly = false) vì chúng ta sẽ ghi
    public UserDtos.UserProfileDTO updateUserProfile(String username, UserDtos.ProfileUpdateDTO updateDTO) {
        // 1. Tìm User entity
        User user = findUserByUsername(username);

        // 2. Cập nhật các trường
        user.setFullName(updateDTO.fullName());
        user.setPhoneNumber(updateDTO.phoneNumber());

        // 3. Lưu lại (userRepository.save() sẽ update)
        User updatedUser = userRepository.save(user);

        // 4. Trả về DTO đã cập nhật
        return UserDtos.UserProfileDTO.fromEntity(updatedUser);
    }
}

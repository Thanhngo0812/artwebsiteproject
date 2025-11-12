package com.ct08team.artbackendproject.DTO.Auth;

import com.ct08team.artbackendproject.Entity.auth.User;
import com.ct08team.artbackendproject.Entity.auth.Address;

import java.math.BigDecimal;

// (Giả sử bạn cũng tạo Entity/Address.java từ CSDL)

public class UserDtos {

    /**
     * DTO để trả về thông tin hồ sơ (GET /api/v1/users/me)
     */
    public record UserProfileDTO(
            String username,
            String email,
            String fullName,
            String phoneNumber
    ) {
        // Hàm chuyển đổi từ Entity sang DTO
        public static UserProfileDTO fromEntity(User user) {
            return new UserProfileDTO(
                    user.getUsername(),
                    user.getEmail(),
                    user.getFullName(), // CSDL là full_name, Entity nên là fullName
                    user.getPhoneNumber() // CSDL là phone_number, Entity nên là phoneNumber
            );
        }
    }

    /**
     * DTO để cập nhật hồ sơ (PUT /api/v1/users/me)
     * (Chỉ chứa các trường được phép cập nhật)
     */
    public record ProfileUpdateDTO(
            String fullName,
            String phoneNumber
    ) {}

    /**
     * DTO để hiển thị, thêm, hoặc cập nhật một địa chỉ
     */
    public record AddressDTO(
            Long id,
            String addressName,
            String address,
            BigDecimal latitude,
            BigDecimal longitude,
            boolean isDefault
    ) {
        // Hàm chuyển đổi từ Entity sang DTO
        public static AddressDTO fromEntity(Address address) {
            return new AddressDTO(
                    address.getId(),
                    address.getAddressName(),
                    address.getAddress(),
                    address.getLatitude(),
                    address.getLongitude(),
                    address.isDefault()
            );
        }
    }

    /**
     * DTO để TẠO một địa chỉ mới (Không cần ID hoặc isDefault)
     */
    public record AddressCreateDTO(
            String addressName,
            String address,
            BigDecimal latitude,
            BigDecimal longitude
    ) {}

}
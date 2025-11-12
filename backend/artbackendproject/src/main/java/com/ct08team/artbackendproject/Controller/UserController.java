package com.ct08team.artbackendproject.Controller;


import com.ct08team.artbackendproject.DTO.Auth.UserDtos;
import com.ct08team.artbackendproject.Entity.auth.User;
import com.ct08team.artbackendproject.Service.Auth.AddressService;
import com.ct08team.artbackendproject.Service.Auth.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private AddressService addressService;

    /**
     * API 1: Lấy thông tin hồ sơ của người dùng hiện tại
     * (React: fetchAllData)
     */
    @GetMapping("/me")
    public ResponseEntity<UserDtos.UserProfileDTO> getUserProfile(Principal principal) {
        // principal.getName() sẽ trả về 'username' (từ token)
        UserDtos.UserProfileDTO profile = userService.getUserProfile(principal.getName());
        return ResponseEntity.ok(profile);
    }

    /**
     * API 2: Cập nhật thông tin hồ sơ (Họ tên, SĐT)
     * (React: handleProfileUpdate)
     */
    @PutMapping("/me")
    public ResponseEntity<UserDtos.UserProfileDTO> updateUserProfile(
            Principal principal,
            @RequestBody UserDtos.ProfileUpdateDTO updateDTO) {

        UserDtos.UserProfileDTO updatedProfile = userService.updateUserProfile(principal.getName(), updateDTO);
        return ResponseEntity.ok(updatedProfile);
    }

    /**
     * API 3: Lấy TẤT CẢ địa chỉ của người dùng hiện tại
     * (React: fetchAllData)
     */
    @GetMapping("/me/addresses")
    public ResponseEntity<List<UserDtos.AddressDTO>> getUserAddresses(Principal principal) {
        User currentUser = userService.findUserByUsername(principal.getName());
        List<UserDtos.AddressDTO> addresses = addressService.getUserAddresses(currentUser);
        return ResponseEntity.ok(addresses);
    }

    /**
     * API 4: Thêm một địa chỉ mới
     * (React: handleAddressAdd)
     */
    @PostMapping("/me/addresses")
    public ResponseEntity<UserDtos.AddressDTO> addAddress(
            Principal principal,
            @RequestBody UserDtos.AddressCreateDTO createDTO) {

        User currentUser = userService.findUserByUsername(principal.getName());
        UserDtos.AddressDTO newAddress = addressService.addAddress(currentUser, createDTO);
        return ResponseEntity.ok(newAddress); // Trả về địa chỉ đã tạo (có ID)
    }

    /**
     * API 5: Xóa một địa chỉ
     * (React: handleAddressDelete)
     */
    @DeleteMapping("/me/addresses/{addressId}")
    public ResponseEntity<?> deleteAddress(
            Principal principal,
            @PathVariable Long addressId) {

        User currentUser = userService.findUserByUsername(principal.getName());
        addressService.deleteAddress(currentUser, addressId);
        return ResponseEntity.ok().build(); // Trả về 200 OK (Không cần nội dung)
    }

    /**
     * API 6: Đặt một địa chỉ làm mặc định
     * (React: handleSetDefaultAddress)
     */
    @PutMapping("/me/addresses/{addressId}/set-default")
    public ResponseEntity<List<UserDtos.AddressDTO>> setDefaultAddress(
            Principal principal,
            @PathVariable Long addressId) {

        User currentUser = userService.findUserByUsername(principal.getName());
        // Hàm service này sẽ cập nhật CSDL và trả về danh sách MỚI
        List<UserDtos.AddressDTO> updatedAddresses = addressService.setDefaultAddress(currentUser, addressId);
        return ResponseEntity.ok(updatedAddresses);
    }

}
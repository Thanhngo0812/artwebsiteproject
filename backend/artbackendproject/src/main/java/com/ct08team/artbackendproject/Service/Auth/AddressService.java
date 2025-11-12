package com.ct08team.artbackendproject.Service.Auth;

import com.ct08team.artbackendproject.DAO.Auth.AddressRepository;
import com.ct08team.artbackendproject.DTO.Auth.UserDtos;
import com.ct08team.artbackendproject.Entity.auth.User;
import com.ct08team.artbackendproject.Entity.auth.Address;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service // <-- Đổi từ interface thành @Service
public class AddressService {

    @Autowired
    private AddressRepository addressRepository;

    /**
     * Lấy TẤT CẢ địa chỉ của một người dùng
     */
    @Transactional(readOnly = true)
    public List<UserDtos.AddressDTO> getUserAddresses(User user) {
        return addressRepository.findByUser(user)
                .stream()
                .map(UserDtos.AddressDTO::fromEntity) // Chuyển đổi Address -> AddressDTO
                .collect(Collectors.toList());
    }

    /**
     * Thêm một địa chỉ mới cho người dùng
     */
    @Transactional
    public UserDtos.AddressDTO addAddress(User user, UserDtos.AddressCreateDTO createDTO) {
        Address newAddress = new Address();
        newAddress.setUser(user); // <-- Liên kết địa chỉ này với User
        newAddress.setAddressName(createDTO.addressName());
        newAddress.setAddress(createDTO.address());
        newAddress.setLatitude(createDTO.latitude());
        newAddress.setLongitude(createDTO.longitude());
        // Lưu và trả về DTO
        Address savedAddress = addressRepository.save(newAddress);
        return UserDtos.AddressDTO.fromEntity(savedAddress);
    }

    /**
     * Xóa một địa chỉ (Phải kiểm tra xem địa chỉ này có thuộc user không)
     */
    @Transactional
    public void deleteAddress(User user, Long addressId) {
        // 1. Tìm địa chỉ bằng ID VÀ User (để bảo mật)
        Address address = addressRepository.findByIdAndUser(addressId, user)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy địa chỉ hoặc bạn không có quyền xóa địa chỉ này."));

        // (Nếu địa chỉ bị xóa là "mặc định", bạn có thể thêm logic
        // để chọn một địa chỉ khác làm mặc định ở đây)

        // 2. Xóa
        addressRepository.delete(address);
    }

    /**
     * Đặt một địa chỉ làm mặc định (và bỏ mặc định các địa chỉ cũ)
     */
    @Transactional
    public List<UserDtos.AddressDTO> setDefaultAddress(User user, Long addressId) {
        // 1. Tìm địa chỉ mục tiêu
        Address targetAddress = addressRepository.findByIdAndUser(addressId, user)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy địa chỉ hoặc bạn không có quyền sửa địa chỉ này."));

        // 2. Lấy TẤT CẢ địa chỉ của user
        List<Address> allAddresses = addressRepository.findByUser(user);

        // 3. Cập nhật trạng thái
        for (Address addr : allAddresses) {
            // Nếu là địa chỉ mục tiêu -> set true
            // Nếu là địa chỉ khác -> set false
            addr.setDefault(addr.getId().equals(addressId));
        }

        // 4. Lưu tất cả thay đổi
        List<Address> updatedAddresses = addressRepository.saveAll(allAddresses);

        // 5. Trả về danh sách DTO đã cập nhật
        return updatedAddresses.stream()
                .map(UserDtos.AddressDTO::fromEntity)
                .collect(Collectors.toList());
    }
}
package com.ct08team.artbackendproject.Controller;

import com.ct08team.artbackendproject.DTO.User.UserDTO;
import com.ct08team.artbackendproject.DTO.User.UserFilterRequestDTO;
import com.ct08team.artbackendproject.DTO.User.UserUpdateDTO;
import com.ct08team.artbackendproject.Service.Admin.AdminUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminUserController {

    @Autowired
    private AdminUserService adminUserService;

    @GetMapping
    public ResponseEntity<?> getUsers(
            @RequestParam(required = false) Long id,
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String fullname,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        UserFilterRequestDTO filter = new UserFilterRequestDTO();
        filter.setId(id);
        filter.setUsername(username);
        filter.setEmail(email);
        filter.setFullName(fullname);
        filter.setRole(role);
        filter.setStatus(status);

        Pageable pageable = PageRequest.of(page, size);
        Page<UserDTO> users = adminUserService.getUsers(filter, pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("content", users.getContent());
        response.put("totalElements", users.getTotalElements());
        response.put("totalPages", users.getTotalPages());
        response.put("currentPage", users.getNumber());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        UserDTO user = adminUserService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(
            @PathVariable Long id,
            @RequestBody UserUpdateDTO updateDTO) {
        UserDTO updatedUser = adminUserService.updateUser(id, updateDTO);
        return ResponseEntity.ok(updatedUser);
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<UserDTO> toggleUserStatus(@PathVariable Long id) {
        UserDTO user = adminUserService.toggleUserStatus(id);
        return ResponseEntity.ok(user);
    }

    @PatchMapping("/{id}/ban")
    public ResponseEntity<UserDTO> banUser(@PathVariable Long id) {
        UserDTO user = adminUserService.banUser(id);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        adminUserService.deleteUser(id);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }
}
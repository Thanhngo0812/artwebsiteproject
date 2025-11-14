package com.ct08team.artbackendproject.Service.Admin;

import com.ct08team.artbackendproject.DAO.Auth.RoleRepository;
import com.ct08team.artbackendproject.DAO.Auth.UserRepository;
import com.ct08team.artbackendproject.DTO.User.UserDTO;
import com.ct08team.artbackendproject.DTO.User.UserFilterRequestDTO;
import com.ct08team.artbackendproject.DTO.User.UserUpdateDTO;
import com.ct08team.artbackendproject.Entity.auth.Role;
import com.ct08team.artbackendproject.Entity.auth.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AdminUserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Transactional(readOnly = true)
    public Page<UserDTO> getUsers(UserFilterRequestDTO filter, Pageable pageable) {
        List<User> users = userRepository.findAll();

        List<User> filteredUsers = users.stream()
            .filter(user -> {
                if (filter.getId() != null && !user.getId().equals(filter.getId())) {
                    return false;
                }

                if (filter.getUsername() != null && !filter.getUsername().isEmpty()) {
                    if (!user.getUsername().toLowerCase().contains(filter.getUsername().toLowerCase())) {
                        return false;
                    }
                }

                if (filter.getEmail() != null && !filter.getEmail().isEmpty()) {
                    if (!user.getEmail().toLowerCase().contains(filter.getEmail().toLowerCase())) {
                        return false;
                    }
                }

                if (filter.getFullName() != null && !filter.getFullName().isEmpty()) {
                    if (user.getFullName() == null || 
                        !user.getFullName().toLowerCase().contains(filter.getFullName().toLowerCase())) {
                        return false;
                    }
                }

                if (filter.getRole() != null && !filter.getRole().isEmpty()) {
                    boolean hasRole = user.getRoles().stream()
                        .anyMatch(role -> role.getName().equals(filter.getRole()));
                    if (!hasRole) return false;
                }

                if (filter.getStatus() != null && !filter.getStatus().isEmpty()) {
                    String status = filter.getStatus();
                    if (status.equals("ACTIVE") && !user.isEnabled()) return false;
                    if (status.equals("INACTIVE") && (user.isEnabled() || !user.isAccountNonLocked())) return false;
                    if (status.equals("BANNED") && user.isAccountNonLocked()) return false;
                }

                return true;
            })
            .collect(Collectors.toList());

        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), filteredUsers.size());

        if (start > filteredUsers.size()) {
            return Page.empty(pageable);
        }

        List<User> pageContent = filteredUsers.subList(start, end);
        List<UserDTO> dtoList = pageContent.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());

        return new PageImpl<>(dtoList, pageable, filteredUsers.size());
    }

    @Transactional(readOnly = true)
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return convertToDTO(user);
    }

    @Transactional
    public UserDTO updateUser(Long id, UserUpdateDTO updateDTO) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (updateDTO.getFullName() != null) {
            user.setFullName(updateDTO.getFullName());
        }

        if (updateDTO.getPhoneNumber() != null) {
            user.setPhoneNumber(updateDTO.getPhoneNumber());
        }

        if (updateDTO.getEmail() != null) {
            user.setEmail(updateDTO.getEmail());
        }

        if (updateDTO.getEnabled() != null) {
            user.setEnabled(updateDTO.getEnabled());
        }

        if (updateDTO.getAccountNonLocked() != null) {
            user.setAccountNonLocked(updateDTO.getAccountNonLocked());
        }

        if (updateDTO.getRoles() != null) {
            Set<Role> roles = new HashSet<>();
            for (String roleName : updateDTO.getRoles()) {
                Role role = roleRepository.findByName(roleName)
                    .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));
                roles.add(role);
            }
            user.setRoles(roles);
        }

        User savedUser = userRepository.save(user);
        return convertToDTO(savedUser);
    }

    @Transactional
    public UserDTO toggleUserStatus(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.isEnabled()) {
            user.setEnabled(false);
        } else {
            user.setEnabled(true);
            user.setAccountNonLocked(true);
        }

        User savedUser = userRepository.save(user);
        return convertToDTO(savedUser);
    }

    @Transactional
    public UserDTO banUser(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));

        user.setEnabled(false);
        user.setAccountNonLocked(false);

        User savedUser = userRepository.save(user);
        return convertToDTO(savedUser);
    }

    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(id);
    }

    private UserDTO convertToDTO(User user) {
        Set<String> roleNames = user.getRoles().stream()
            .map(Role::getName)
            .collect(Collectors.toSet());

        return new UserDTO(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getFullName(),
            user.getPhoneNumber(),
            user.isEnabled(),
            user.isAccountNonLocked(),
            roleNames,
            user.getCreatedAt(),
            user.getUpdatedAt()
        );
    }
}
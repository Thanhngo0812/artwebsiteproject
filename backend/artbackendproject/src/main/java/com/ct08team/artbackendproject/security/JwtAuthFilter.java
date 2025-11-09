package com.ct08team.artbackendproject.security;

import com.ct08team.artbackendproject.DAO.Auth.UserRepository;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    // === SỬA LỖI: Bỏ UserDetailsService, dùng UserRepository ===
    @Autowired
    private UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        try {
            final String authHeader = request.getHeader("Authorization");
            final String token;
            final String username;

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                filterChain.doFilter(request, response);
                return;
            }

            token = authHeader.substring(7);
            username = jwtUtil.extractUsername(token);

            // Nếu có username và chưa được xác thực trong context
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                // === SỬA LỖI: Tự tìm User và tạo UserDetails, giống hệt SecurityConfig ===

                // 1. Tìm User entity của chúng ta
                com.ct08team.artbackendproject.Entity.auth.User user = this.userRepository.findByUsernameOrEmail(username,username)
                        .orElseThrow(() -> new RuntimeException("User not found in JWT filter"));

                // 2. Lấy danh sách quyền
                Set<GrantedAuthority> authorities = user.getRoles().stream()
                        .map(role -> new SimpleGrantedAuthority(role.getName()))
                        .collect(Collectors.toSet());

                // 3. Tạo UserDetails (của Spring Security) từ User entity
                UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                        user.getUsername(),
                        user.getPassword(), // Lấy password đã hash
                        user.isEnabled(),
                        true, // accountNonExpired
                        true, // credentialsNonExpired
                        user.isAccountNonLocked(),
                        authorities
                );
                // === Kết thúc sửa lỗi ===

                // 4. Xác thực token
                if (jwtUtil.validateToken(token, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null, // Credentials (password) là null khi xác thực bằng token
                            userDetails.getAuthorities()
                    );
                    authToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                    );
                    // Đưa vào SecurityContext
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (ExpiredJwtException e) {
            logger.warn("JWT token has expired: " + e.getMessage());
        } catch (Exception e) {
            logger.warn("JWT Authentication error: " + e.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}

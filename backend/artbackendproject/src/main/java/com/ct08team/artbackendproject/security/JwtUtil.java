package com.ct08team.artbackendproject.security;
import com.ct08team.artbackendproject.Entity.auth.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.*;
import java.util.function.Function;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration.ms}")
    private long jwtExpirationMs;

    private Key getSigningKey() {
        byte[] keyBytes = Base64.getDecoder().decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(String username) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, username);
    }
    public String generateToken(String username, List<String> roles) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", roles); // Thêm roles vào "claims"
        return createToken(claims, username);
    }


    /**
     * (Hàm quá tải) Tạo Token với thời hạn tùy chỉnh (tính bằng PHÚT)
     * AuthService.java gọi hàm này với (username, roles, 10)
     */
    public String generateToken(String username, List<String> roles, long expirationInMinutes) {
        long expirationTimeMs = expirationInMinutes * 60 * 1000; // Đổi phút sang mili-giây
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, username, expirationTimeMs);
    }
    private String createToken(Map<String, Object> claims, String subject, long expirationTimeMs) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                // SỬA: Dùng thời hạn được truyền vào
                .setExpiration(new Date(System.currentTimeMillis() + expirationTimeMs))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }
    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }
    public Boolean validateToken(String token) {
        try {
            // Chỉ cần gọi extractAllClaims, nó sẽ ném lỗi
            // (ví dụ: ExpiredJwtException, SignatureException)
            // nếu token không hợp lệ hoặc hết hạn.
            extractAllClaims(token);
            return true; // Hợp lệ
        } catch (JwtException | IllegalArgumentException e) {
            // Bất kỳ lỗi nào (Hết hạn, Sai chữ ký, Dị dạng, v.v.)
            System.err.println("Xác thực JWT thất bại: " + e.getMessage());
            return false; // Không hợp lệ
        }
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
}

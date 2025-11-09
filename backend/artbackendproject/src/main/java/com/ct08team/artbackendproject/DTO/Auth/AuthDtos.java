package com.ct08team.artbackendproject.DTO.Auth;

// Dùng chung 1 file cho tiện
public class AuthDtos {

    public record LoginRequest(String username, String password) {}

    public record OtpRequest(String username, String otp) {}

    public record AuthResponse(String token) {}

    public record LoginResponse(String message) {}
    public record ResendOtpRequest(String username) {}

    // Thêm class này vào bên trong file AuthDtos.java của bạn

}

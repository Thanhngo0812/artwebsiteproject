package com.ct08team.artbackendproject.DTO.Auth;

// Dùng chung 1 file cho tiện
public class AuthDtos {

    public record LoginRequest(String username, String password) {}

    public record OtpRequest(String username, String otp) {}

    public record AuthResponse(String token) {}

    public record LoginResponse(String message) {}
    public record ResendOtpRequest(String username) {}
    public record RegisterRequest(String username, String email, String password) {}

    // Thêm class này vào bên trong file AuthDtos.java của bạn
    // =======================================================
    // MỚI: DTOs cho Luồng Quên Mật Khẩu
    // (Đã thêm dựa trên yêu cầu của 3 trang React)
    // =======================================================

    /** Dùng cho /forgot-password */
    public record EmailRequest(String email) {}

    /** Dùng cho /verify-forgot-otp (gửi email thay vì username) */
    public record OtpEmailRequest(String email, String otp) {}

    /** Dùng cho /reset-password */
    public record ResetPasswordRequest(String email, String token, String newPassword) {}
}

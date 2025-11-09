package com.ct08team.artbackendproject.Controller;


import com.ct08team.artbackendproject.DTO.Auth.AuthDtos;
import com.ct08team.artbackendproject.Service.Auth.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    // Bước 1: Đăng nhập -> Gửi OTP
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthDtos.LoginRequest loginRequest) {
        try {
            AuthDtos.LoginResponse response = authService.loginAndSendOtp(loginRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi đăng nhập: " + e.getMessage());
        }
    }

    // Bước 2: Xác thực OTP -> Trả Token
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody AuthDtos.OtpRequest otpRequest) {
        try {
            AuthDtos.AuthResponse response = authService.verifyOtpAndLogin(otpRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi xác thực OTP: " + e.getMessage());
        }
    }

    // =======================================================
    // MỚI: Endpoint để gửi lại OTP
    // =======================================================
    @PostMapping("/resend-otp")
    public ResponseEntity<?> resendOtp(@RequestBody AuthDtos.ResendOtpRequest resendRequest) {
        try {
            // Bạn sẽ cần tạo phương thức 'resendOtp' này trong AuthService
            authService.resendOtp(resendRequest);

            // Frontend chỉ cần response.ok, nên chúng ta trả về 1 message đơn giản
            return ResponseEntity.ok("Mã OTP đã được gửi lại thành công.");

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi gửi lại OTP: " + e.getMessage());
        }
    }
}

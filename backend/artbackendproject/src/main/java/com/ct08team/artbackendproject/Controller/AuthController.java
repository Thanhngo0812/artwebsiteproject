package com.ct08team.artbackendproject.Controller;


import com.ct08team.artbackendproject.DTO.Auth.AuthDtos;
import com.ct08team.artbackendproject.Service.Auth.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.DisabledException;
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
            // Dòng này VẪN sẽ ném DisabledException nếu user.enabled == false
            AuthDtos.LoginResponse response = authService.loginAndSendOtp(loginRequest);
            return ResponseEntity.ok(response);

            // =======================================================
            // MỚI: Bắt LỖI CỤ THỂ "DisabledException"
            // =======================================================
        } catch (DisabledException e) {
            // Lỗi này xảy ra khi MẬT KHẨU ĐÚNG, nhưng enabled=false.
            // Đây chính là kịch bản của bạn!
            // Chúng ta sẽ gửi lại OTP cho họ.
            try {
                // Tận dụng hàm resendOtp đã viết
                authService.resendOtp(new AuthDtos.ResendOtpRequest(loginRequest.username()));

                // Trả về OK (200) để frontend biết và điều hướng sang trang /verify-otp
                return ResponseEntity.ok(new AuthDtos.LoginResponse("Tài khoản chưa kích hoạt. Mã OTP mới đã được gửi đến email của bạn."));

            } catch (Exception resendException) {
                // Xử lý nếu có lỗi khi cố gửi lại (ví dụ: không tìm thấy user, v.v.)
                return ResponseEntity.badRequest().body("Lỗi gửi lại OTP: " + resendException.getMessage());
            }
            // =======================================================
            // KẾT THÚC XỬ LÝ MỚI
            // =======================================================

        } catch (Exception e) {
            // Các lỗi khác (ví dụ: BadCredentialsException - Sai mật khẩu)
            // sẽ rơi vào đây và báo lỗi như bình thường.
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

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthDtos.RegisterRequest registerRequest) {
        try {
            // CẬP NHẬT: Gọi registerUser và nhận về LoginResponse
            AuthDtos.LoginResponse response = authService.registerUser(registerRequest);

            // Trả về response (ví dụ: { "message": "..." })
            // Frontend sẽ dùng response này để điều hướng tới /verify-otp
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            // Trả về lỗi (ví dụ: Username đã tồn tại)
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

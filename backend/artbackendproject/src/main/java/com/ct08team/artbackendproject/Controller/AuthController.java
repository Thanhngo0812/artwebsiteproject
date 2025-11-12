package com.ct08team.artbackendproject.Controller;


import com.ct08team.artbackendproject.DTO.Auth.AuthDtos;
import com.ct08team.artbackendproject.Service.Auth.AuthService;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailSendException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
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
        } catch (MailSendException | MessagingException e) {
            // Lỗi liên quan đến email (ví dụ: email không tồn tại)
            return ResponseEntity.badRequest().body("Email không hợp lệ hoặc không thể gửi. Vui lòng kiểm tra lại.");
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

        }
        catch (LockedException e) {
            // Xử lý nếu có lỗi khi cố gửi lại (ví dụ: không tìm thấy user, v.v.)
            return ResponseEntity.badRequest().body("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ admin: 0909246319");
        }
        catch (Exception e) {
            // Các lỗi khác (ví dụ: BadCredentialsException - Sai mật khẩu)
            // sẽ rơi vào đây và báo lỗi như bình thường.
            return ResponseEntity.badRequest().body("Lỗi đăng nhập: Tên đăng nhập hoặc mật khẩu không đúng ");
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
        } catch (MailSendException | MessagingException e) {
            // Lỗi liên quan đến email (ví dụ: email không tồn tại)
            return ResponseEntity.badRequest().body("Email không hợp lệ hoặc không thể gửi. Vui lòng kiểm tra lại.");
        } catch (Exception e) {
            // Trả về lỗi (ví dụ: Username đã tồn tại)
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }




    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody AuthDtos.EmailRequest emailRequest) {
        try {
            authService.processForgotPassword(emailRequest.email());
            return ResponseEntity.ok("OTP khôi phục mật khẩu đã được gửi đến email của bạn.");
        } catch (MailSendException | MessagingException e) {
            return ResponseEntity.badRequest().body("Email không hợp lệ hoặc không thể gửi. Vui lòng kiểm tra lại.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage()); // VD: "Không tìm thấy email"
        }
    }

    /**
     * Bước 2: Người dùng xác thực OTP.
     * (React: VerifyPasswordOTP.jsx)
     */
    @PostMapping("/verify-forgot-otp")
    public ResponseEntity<?> verifyForgotPasswordOtp(@RequestBody AuthDtos.OtpEmailRequest otpRequest) {
        try {
            // Service sẽ kiểm tra OTP và trả về 1 token reset tạm thời
            AuthDtos.AuthResponse response = authService.verifyForgotPasswordOtp(otpRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage()); // VD: "Mã OTP không hợp lệ"
        }
    }

    /**
     * Bước 3: Người dùng đặt mật khẩu mới.
     * (React: ResetPassword.jsx)
     */
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody AuthDtos.ResetPasswordRequest resetRequest) {
        try {
            authService.resetPassword(resetRequest);
            return ResponseEntity.ok("Đã cập nhật mật khẩu thành công.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage()); // VD: "Token không hợp lệ hoặc đã hết hạn"
        }
    }
}

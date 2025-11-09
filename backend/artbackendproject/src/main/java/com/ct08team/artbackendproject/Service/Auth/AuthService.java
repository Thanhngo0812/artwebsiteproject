package com.ct08team.artbackendproject.Service.Auth;

import com.ct08team.artbackendproject.DAO.Auth.UserRepository;
import com.ct08team.artbackendproject.DTO.Auth.AuthDtos;
import com.ct08team.artbackendproject.Entity.auth.User;
import com.ct08team.artbackendproject.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private EmailService emailService;
    @Autowired
    private PasswordEncoder passwordEncoder; // Bạn cần Bean này trong SecurityConfig

    private static final long OTP_VALID_DURATION_MINUTES = 5;

    // Bước 1: Đăng nhập và Gửi OTP
    public AuthDtos.LoginResponse loginAndSendOtp(AuthDtos.LoginRequest loginRequest) {
        // 1. Xác thực username/password
        System.out.println(loginRequest.username());
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.username(), loginRequest.password())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 2. Tìm User
        User user = userRepository.findByUsernameOrEmail(loginRequest.username(),loginRequest.username())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        // 3. Tạo và Lưu OTP
        String otp = generateOtp();
        user.setOtp(otp);
        user.setOtpRequestedTime(Instant.now());
        userRepository.save(user);

        // 4. Gửi OTP qua Email
        emailService.sendOtpEmail(user.getEmail(), otp);

        return new AuthDtos.LoginResponse("Mã OTP đã được gửi tới email của bạn. Vui lòng xác thực.");
    }

    // Bước 2: Xác thực OTP và Trả về Token
    public AuthDtos.AuthResponse verifyOtpAndLogin(AuthDtos.OtpRequest otpRequest) {
        // 1. Tìm User
        User user = userRepository.findByUsernameOrEmail(otpRequest.username(),otpRequest.username())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        // 2. Kiểm tra OTP
        if (user.getOtp() == null || !user.getOtp().equals(otpRequest.otp())) {
            throw new RuntimeException("Mã OTP không hợp lệ.");
        }

        // 3. Kiểm tra thời gian hết hạn
        Instant otpCreationTime = user.getOtpRequestedTime();
        if (otpCreationTime == null) {
            throw new RuntimeException("Vui lòng yêu cầu OTP trước.");
        }

        long minutesElapsed = Duration.between(otpCreationTime, Instant.now()).toMinutes();
        if (minutesElapsed > OTP_VALID_DURATION_MINUTES) {
            throw new RuntimeException("Mã OTP đã hết hạn.");
        }

        // 4. Xác thực thành công -> Xóa OTP
        user.setOtp(null);
        user.setOtpRequestedTime(null);
        userRepository.save(user);

        // 5. Tạo và trả về JWT Token
        List<String> roleNames = user.getRoles().stream()
                .map(role -> role.getName()) // Giả sử Role entity có hàm getName()
                .collect(Collectors.toList());

        // Truyền cả username và roles vào hàm tạo token
        String jwtToken = jwtUtil.generateToken(user.getUsername(), roleNames);
        return new AuthDtos.AuthResponse(jwtToken);
    }

    // =======================================================
    // MỚI: Phương thức để gửi lại OTP
    // =======================================================
    public void resendOtp(AuthDtos.ResendOtpRequest resendRequest) {
        // 1. Tìm User
        User user = userRepository.findByUsernameOrEmail(resendRequest.username(), resendRequest.username())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng: " + resendRequest.username()));

        // 2. Tạo và Lưu OTP mới
        String otp = generateOtp();
        user.setOtp(otp);
        user.setOtpRequestedTime(Instant.now());
        userRepository.save(user);

        // 3. Gửi OTP mới qua Email
        emailService.sendOtpEmail(user.getEmail(), otp);

    }

    // Hàm tiện ích tạo OTP 6 số
    private String generateOtp() {
        SecureRandom random = new SecureRandom();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }

    // (Bạn cũng nên thêm hàm đăng ký (register) ở đây)
}
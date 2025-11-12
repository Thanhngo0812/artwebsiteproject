package com.ct08team.artbackendproject.Service.Auth;

import com.ct08team.artbackendproject.DAO.Auth.RoleRepository;
import com.ct08team.artbackendproject.DAO.Auth.UserRepository;
import com.ct08team.artbackendproject.DTO.Auth.AuthDtos;
import com.ct08team.artbackendproject.Entity.auth.Role;
import com.ct08team.artbackendproject.Entity.auth.User;
import com.ct08team.artbackendproject.security.JwtUtil;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Collections;
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
    @Autowired
    private UserDetailsService userDetailsService;
    @Autowired
    private RoleRepository roleRepository;
    private static final long OTP_VALID_DURATION_MINUTES = 5;

    // Bước 1: Đăng nhập và Gửi OTP
    @Transactional(rollbackFor = Exception.class)
    public AuthDtos.LoginResponse loginAndSendOtp(AuthDtos.LoginRequest loginRequest) throws MessagingException {
        // 1. Xác thực username/password
        UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.username());

        // 2. KIỂM TRA MẬT KHẨU TRƯỚC TIÊN
        if (!passwordEncoder.matches(loginRequest.password(), userDetails.getPassword())) {
            // Nếu MẬT KHẨU SAI -> ném lỗi BadCredentialsException
            // (Lỗi này sẽ bị bắt bởi 'catch (Exception e)' trong AuthController)
            throw new BadCredentialsException("Tên đăng nhập hoặc mật khẩu không đúng.");
        }

        // 3. Mật khẩu ĐÚNG. BÂY GIỜ mới kiểm tra 'enabled'
        if (!userDetails.isEnabled()) {
            // Ném lỗi 'Disabled' (sẽ được AuthController bắt chính xác)
            throw new DisabledException("Tài khoản chưa kích hoạt.");
        }

        // 4. Mật khẩu ĐÚNG, Tài khoản ENABLED. Kiểm tra 'locked'
        if (!userDetails.isAccountNonLocked()) {
            // Ném lỗi 'Locked' (sẽ được AuthController bắt chính xác)
            throw new LockedException("Tài khoản đã bị khóa.");
        }
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


    @Transactional
    // Bước 2: Xác thực OTP và Trả về Token
    public AuthDtos.AuthResponse verifyOtpAndLogin(AuthDtos.OtpRequest otpRequest) throws MessagingException {
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
        user.setEnabled(true);

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
    @Transactional(rollbackFor = Exception.class)

    public void resendOtp(AuthDtos.ResendOtpRequest resendRequest) throws MessagingException {
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
    // =======================================================
    // MỚI: Phương thức để Đăng ký
    // =======================================================
    @Transactional(rollbackFor = Exception.class)

    public AuthDtos.LoginResponse registerUser(AuthDtos.RegisterRequest registerRequest) throws MessagingException {
        // 1. Kiểm tra username đã tồn tại
        if (userRepository.existsByUsername(registerRequest.username())) {
            throw new RuntimeException("Tên đăng nhập đã được sử dụng.");
        }

        // 2. Kiểm tra email đã tồn tại
        if (userRepository.existsByEmail(registerRequest.email())) {
            throw new RuntimeException("Email đã được sử dụng.");
        }

        // 3. (Tùy chọn) Kiểm tra mật khẩu (ví dụ: độ dài)
        if (registerRequest.password().length() < 8) {
            throw new RuntimeException("Mật khẩu phải có ít nhất 8 ký tự.");
        }

        // 4. Mã hóa mật khẩu
        String encodedPassword = passwordEncoder.encode(registerRequest.password());

        // 5. Tạo user mới
        User newUser = new User();
        newUser.setUsername(registerRequest.username());
        newUser.setEmail(registerRequest.email());
        newUser.setPassword(encodedPassword);

        // 6. Gán vai trò (Role) mặc định
        // Đảm bảo bạn đã có Role "ROLE_USER" trong DB
        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("Lỗi: Không tìm thấy Role 'ROLE_USER' mặc định."));
        newUser.setRoles(Collections.singleton(userRole)); // Gán 1 role duy nhất
        String otp = generateOtp();
        newUser.setOtp(otp);
        newUser.setOtpRequestedTime(Instant.now());
        // 7. Lưu user
        userRepository.save(newUser);
        // 8. GỬI EMAIL OTP
        emailService.sendOtpEmail(newUser.getEmail(), otp);

        // 9. Trả về thông báo để frontend điều hướng
        return new AuthDtos.LoginResponse("Đăng ký thành công. Mã OTP đã được gửi tới email của bạn.");
        // 8. (Tùy chọn) Bạn có thể gửi email chào mừng ở đây
        // emailService.sendWelcomeEmail(newUser.getEmail());
    }

    /**
     * Bước 1: Xử lý yêu cầu quên mật khẩu
     * (React: ForgotPassword.jsx)
     */
    @Transactional(rollbackFor = Exception.class)
    public void processForgotPassword(String email) throws MessagingException {


        User user = userRepository.findByEmail(email) // Cần thêm findByEmail vào UserRepository
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản nào liên kết với email này."));
// 4. Mật khẩu ĐÚNG, Tài khoản ENABLED. Kiểm tra 'locked'
        if (!user.isAccountNonLocked()) {
            // Ném lỗi 'Locked' (sẽ được AuthController bắt chính xác)
            throw new LockedException("Tài khoản đã bị khóa.");
        }
        // 2. Tạo, lưu OTP và gửi
        String otp = generateOtp();
        user.setOtp(otp);
        user.setOtpRequestedTime(Instant.now());
        userRepository.save(user);

        // 3. Gửi email
        emailService.sendOtpEmail(user.getEmail(), otp);
        // (Ghi chú: EmailService nên dùng một mẫu (template) khác cho "Quên mật khẩu")
    }

    /**
     * Bước 2: Xác thực OTP quên mật khẩu
     * (React: VerifyPasswordOTP.jsx)
     */
    @Transactional
    public AuthDtos.AuthResponse verifyForgotPasswordOtp(AuthDtos.OtpEmailRequest otpRequest) {
        // 1. Tìm User bằng email
        User user = userRepository.findByEmail(otpRequest.email())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng."));

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
            user.setOtp(null); // Xóa OTP hết hạn
            user.setOtpRequestedTime(null);
            userRepository.save(user);
            throw new RuntimeException("Mã OTP đã hết hạn.");
        }

        // 4. Xác thực thành công -> Xóa OTP
        user.setOtp(null);
        user.setOtpRequestedTime(null);
        userRepository.save(user);

        // 5. TẠO TOKEN RESET TẠM THỜI (Rất quan trọng)
        // Tạo JWT với thời hạn ngắn (ví dụ: 10 phút)
        // Chúng ta không cần roles ở đây, chỉ cần username/email
        // (Giả sử hàm generateToken(username, roles, minutes) đã tồn tại trong JwtUtil)
        String resetToken = jwtUtil.generateToken(user.getUsername(), List.of("ROLE_RESET_PASSWORD"), 10); // 10 phút

        return new AuthDtos.AuthResponse(resetToken);
    }

    /**
     * Bước 3: Đặt lại mật khẩu
     * (React: ResetPassword.jsx)
     */
    @Transactional
    public void resetPassword(AuthDtos.ResetPasswordRequest resetRequest) {
        // 1. Xác thực Token reset
        // (Giả sử JwtUtil của bạn có hàm validateToken(token) đơn giản)
        if (!jwtUtil.validateToken(resetRequest.token())) {
            throw new RuntimeException("Token không hợp lệ hoặc đã hết hạn.");
        }

        // 2. Lấy email/username từ token (để bảo mật)
        String usernameFromToken = jwtUtil.extractUsername(resetRequest.token());

        // 3. Tìm user bằng username (an toàn hơn email)
        User user = userRepository.findByUsername(usernameFromToken)
                .orElseThrow(() -> new RuntimeException("Token hợp lệ nhưng không tìm thấy người dùng."));

        // 4. (Kiểm tra chéo) Đảm bảo email từ request khớp với email của user trong CSDL
        if (!user.getEmail().equals(resetRequest.email())) {
            throw new RuntimeException("Token và email không khớp.");
        }

        // 5. Mọi thứ hợp lệ -> Đổi mật khẩu
        user.setPassword(passwordEncoder.encode(resetRequest.newPassword()));
        userRepository.save(user);

        // (Không cần xóa OTP vì nó đã được xóa ở Bước 2)
    }
}
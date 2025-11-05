package com.ct08team.artbackendproject.Service.Auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String to, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("thanhngoslab@gmail.com"); // Email bạn cấu hình ở properties
            message.setTo(to);
            message.setSubject("Mã xác thực 2 lớp (2FA) của bạn");
            message.setText("Mã OTP của bạn là: " + otp + "\n"
                    + "Mã này sẽ hết hạn trong 5 phút.");

            mailSender.send(message);
        } catch (Exception e) {
            // Xử lý lỗi (ví dụ: log lại)
            System.err.println("Lỗi gửi email: " + e.getMessage());
        }
    }
}

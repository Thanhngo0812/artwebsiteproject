package com.ct08team.artbackendproject.Service.Auth;

// MỚI: Import các thư viện cần thiết cho email HTML
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper; // MỚI: Thêm MimeMessageHelper
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String to, String otp) throws MessagingException {
        // THAY ĐỔI: Sử dụng MimeMessage thay vì SimpleMailMessage
        MimeMessage mimeMessage = mailSender.createMimeMessage();

        try {
            // MỚI: Sử dụng MimeMessageHelper để xây dựng email
            // "utf-8" để hỗ trợ tiếng Việt, "true" để kích hoạt chế độ HTML
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

            helper.setFrom("thanhngoslab@gmail.com"); // Email bạn cấu hình ở properties
            helper.setTo(to);
            helper.setSubject("Mã xác thực 2 lớp (2FA) của bạn");

            // MỚI: Tạo nội dung HTML cho email
            String htmlContent = buildHtmlOtpTemplate(otp);

            // THAY ĐỔI: set nội dung là HTML (tham số thứ 2 là 'true')
            helper.setText(htmlContent, true);

            mailSender.send(mimeMessage);

        } catch (MessagingException e) {
            // Xử lý lỗi (ví dụ: log lại)
            System.err.println("Lỗi gửi email: " + e.getMessage());
        }
    }

    // MỚI: Hàm tiện ích để tạo mẫu HTML
    private String buildHtmlOtpTemplate(String otp) {
        // (Đây là link bạn đã cung cấp)
        String logoUrl = "https://i.postimg.cc/BQxjTpYz/logo.png"; // <-- Link logo của bạn

        // --- CẬP NHẬT CSS SANG GIAO DIỆN TỐI (DARK MODE) ---
        // --- BAO GỒM BẢN VÁ LỖI CHO GMAIL DARK MODE ---

        return "<html lang='vi'>"
                + "<head>"
                + "  <meta charset='UTF-8'>"
                // MỚI: Thêm meta tags để báo cho email client rằng email này đã hỗ trợ Dark Mode
                + "  <meta name='color-scheme' content='light dark'>"
                + "  <meta name='supported-color-schemes' content='light dark'>"
                // MỚI: Thêm khối style để ép Gmail không tự động đảo ngược màu
                + "  <style>"
                // Các bộ chọn (selector) đặc biệt cho Gmail và các client khác
                + "    :root {"
                + "      color-scheme: light dark;"
                + "      supported-color-schemes: light dark;"
                + "    }"
                + "    @media (prefers-color-scheme: dark) {"
                + "      .dark-mode-bg { background-color: #222 !important; }"
                + "      .dark-mode-text { color: #bbbbbb !important; }"
                + "      .dark-mode-border { border-color: #333 !important; }"
                + "      .dark-mode-logo-invert { filter: invert(1) !important; }"
                + "      .dark-mode-footer-text { color: #888888 !important; }"
                + "      .dark-mode-footer-text-light { color: #777777 !important; }"
                + "      .dark-mode-otp-bg { background-color: #bbbbbb !important; }"
                + "      .dark-mode-otp-text { color: #222 !important; }"
                + "    }"
                // Các bộ chọn data-ogsc (cho Outlook)
                + "    [data-ogsc] .dark-mode-bg { background-color: #222 !important; }"
                + "    [data-ogsc] .dark-mode-text { color: #bbbbbb !important; }"
                + "    [data-ogsc] .dark-mode-border { border-color: #333 !important; }"
                + "    [data-ogsc] .dark-mode-logo-invert { filter: invert(1) !important; }"
                + "    [data-ogsc] .dark-mode-footer-text { color: #888888 !important; }"
                + "    [data-ogsc] .dark-mode-footer-text-light { color: #777777 !important; }"
                + "    [data-ogsc] .dark-mode-otp-bg { background-color: #bbbbbb !important; }"
                + "    [data-ogsc] .dark-mode-otp-text { color: #222 !important; }"
                + "  </style>"
                + "</head>"

                // CHỈNH SỬA: Thêm nền tối cho toàn bộ email client (nếu hỗ trợ)
                + "<body style='font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; '>"

                // CHỈNH SỬA: Thẻ chính với nền tối và chữ sáng + thêm class
                + "  <div class='dark-mode-bg' style='max-width: 600px; margin: 20px auto; padding: 20px; background-color: #222; border: 1px solid #333; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.3);'>"
                + "    <div style='text-align: center; margin-bottom: 20px;'>"

                // CHỈNH SỬA: Thêm filter: invert(1) để đổi logo từ đen sang trắng + thêm class
                + "      <img src='" + logoUrl + "' alt='Logo' class='dark-mode-logo-invert' style='max-width: 150px; height: auto; filter: invert(1);'>"
                + "    </div>"

                // CHỈNH SỬA: Đổi màu chữ h2 sang màu sáng + thêm class
                + "    <h2 class='dark-mode-text' style='color: #bbbbbb; text-align: center; border-bottom: 2px solid #bbbbbb; padding-bottom: 10px;'>Xác thực tài khoản của bạn</h2>"

                // CHỈNH SỬA: Đổi màu chữ p sang màu sáng + thêm class
                + "    <p class='dark-mode-text' style='font-size: 16px; color: #bbbbbb;'>Chào bạn,</p>"
                + "    <p class='dark-mode-text' style='font-size: 16px; color: #bbbbbb;'>Vui lòng sử dụng mã OTP dưới đây để hoàn tất việc xác thực:</p>"

                // Hộp OTP (giữ nguyên vì nền xanh chữ trắng đã đẹp)
                + "    <div style='text-align: center; margin: 30px 0;'>"
                + "      <span class='dark-mode-otp-bg dark-mode-otp-text' style='display: inline-block; padding: 15px 30px; font-size: 32px; font-weight: bold; color: #222; background-color: #bbbbbb; border-radius: 8px; letter-spacing: 3px;'>"
                +         otp
                + "      </span>"
                + "    </div>"
                + "    <p class='dark-mode-text' style='font-size: 16px; color: #bbbbbb;'>Mã này sẽ hết hạn trong 5 phút.</p>"

                // CHỈNH SỬA: Đổi màu chữ footer và màu đường kẻ + thêm class
                + "    <p class='dark-mode-footer-text' style='font-size: 14px; color: #888888; margin-top: 30px; border-top: 1px solid #333; padding-top: 20px; text-align: center;'>"
                + "      Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này hoặc liên hệ với bộ phận hỗ trợ."
                + "    </p>"
                + "    <p class='dark-mode-footer-text-light' style='font-size: 12px; color: #777777; text-align: center;'>© 2025 Tranh Xịn. Đã đăng ký bản quyền.</p>"
                + "  </div>"
                + "</body>"
                + "</html>";
    }
}
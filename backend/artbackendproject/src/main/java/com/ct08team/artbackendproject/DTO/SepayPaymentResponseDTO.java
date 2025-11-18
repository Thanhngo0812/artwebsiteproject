package com.ct08team.artbackendproject.DTO;

import lombok.Data;
import java.util.Map;

/**
 * DTO trả về cho React nếu phương thức là "ONLINE"
 * (Chứa URL của Sepay và Map<String, String>
 * để React tự tạo form ẩn)
 */
@Data
public class SepayPaymentResponseDTO {
    private String status;
    private String message;
    private String paymentUrl; // URL của Sepay (ví dụ: https://pay-sandbox.sepay.vn/v1/checkout/init)
    private Map<String, String> formParams; // Dữ liệu form (merchant, amount, signature...)

    public SepayPaymentResponseDTO(String status, String message, String paymentUrl, Map<String, String> formParams) {
        this.status = status;
        this.message = message;
        this.paymentUrl = paymentUrl;
        this.formParams = formParams;
    }
}
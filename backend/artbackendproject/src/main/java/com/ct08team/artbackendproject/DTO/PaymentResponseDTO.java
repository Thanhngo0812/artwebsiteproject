package com.ct08team.artbackendproject.DTO;

import lombok.Data;

/**
 * DTO trả về cho React nếu phương thức là "ONLINE"
 */
@Data
public class PaymentResponseDTO {
    private String status;
    private String message;
    private String paymentUrl;

    public PaymentResponseDTO(String status, String message, String paymentUrl) {
        this.status = status;
        this.message = message;
        this.paymentUrl = paymentUrl;
    }
}
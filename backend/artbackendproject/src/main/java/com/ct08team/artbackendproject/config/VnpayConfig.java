package com.ct08team.artbackendproject.config;


import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@Data
public class VnpayConfig {
    @Value("${vnpay.url}")
    private String vnpPayUrl;

    @Value("${vnpay.api.url}")
    private String vnpApiUrl;

    @Value("${vnpay.returnUrl}")
    private String vnpReturnUrl;

    @Value("${vnpay.tmnCode}")
    private String vnpTmnCode;

    @Value("${vnpay.hashSecret}")
    private String vnpHashSecret;
}
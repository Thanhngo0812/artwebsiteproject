package com.ct08team.artbackendproject.DTO.Dashboard;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class TopUserStatDTO {
    private Long userId;
    private String username;
    private String email;
    private String fullName;
    private Long totalOrders;
    private BigDecimal totalSpent;

    public TopUserStatDTO(Long userId, String username, String email, String fullName, Long totalOrders, BigDecimal totalSpent) {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.fullName = fullName;
        this.totalOrders = totalOrders;
        this.totalSpent = totalSpent;
    }
}
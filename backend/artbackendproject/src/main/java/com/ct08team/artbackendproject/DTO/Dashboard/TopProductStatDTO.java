package com.ct08team.artbackendproject.DTO.Dashboard;


import lombok.Data;
import java.math.BigDecimal;

@Data
public class TopProductStatDTO {
    private Long productId;
    private String productName;
    private String thumbnail;
    private Long soldQuantity;
    private BigDecimal totalRevenue;

    public TopProductStatDTO(Long productId, String productName, String thumbnail, Long soldQuantity, BigDecimal totalRevenue) {
        this.productId = productId;
        this.productName = productName;
        this.thumbnail = thumbnail;
        this.soldQuantity = soldQuantity;
        this.totalRevenue = totalRevenue;
    }
}
package com.ct08team.artbackendproject.DTO;


import com.ct08team.artbackendproject.Entity.promotion.Promotion;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;

@Data
public class PromotionListDTO {
    private Long id;
    private String name;
    private String description;
    private String imageUrl;
    private String code;
    private String type;
    private BigDecimal value;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private boolean active;
    private BigDecimal minOrderValue;
    private BigDecimal maxDiscountValue;
    private Integer usageLimit;
    private int usageCount;

    public PromotionListDTO(Promotion p) {
        this.id = p.getId();
        this.name = p.getName();
        this.description = p.getDescription();
        this.imageUrl = p.getImageUrl();
        this.code = p.getCode();
        this.type = p.getType().toString();
        this.value = p.getValue();
        this.startDate = p.getStartDate();
        this.endDate = p.getEndDate();
        this.active = p.isActive();
        this.minOrderValue = p.getMinOrderValue();
        this.maxDiscountValue = p.getMaxDiscountValue();
        this.usageLimit = p.getUsageLimit();
        this.usageCount = p.getUsageCount();
    }
}
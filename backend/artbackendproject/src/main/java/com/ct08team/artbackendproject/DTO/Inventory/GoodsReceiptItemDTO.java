package com.ct08team.artbackendproject.DTO.Inventory;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class GoodsReceiptItemDTO {
    private Long id;
    private Long receiptId;
    private Long variantId;
    private String productName;
    private String variantDimensions;
    private int quantity;
    private BigDecimal importPrice;
}
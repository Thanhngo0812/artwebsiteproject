package com.ct08team.artbackendproject.DTO.Inventory;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;

@Data
public class GoodsReceiptDTO {
    private Long id;
    private Long supplierId;
    private String supplierName;
    private String receiptCode;
    private String note;
    private Long creatorId;
    private String creatorName;
    private BigDecimal totalAmount;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private Timestamp createdAt;

    private List<GoodsReceiptItemDTO> receiptItems;
}
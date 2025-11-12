package com.ct08team.artbackendproject.Entity.promotion;

public enum PromotionType {
    /**
     * Giảm giá theo phần trăm (ví dụ: 20%).
     * Giá trị (value) trong DB sẽ là 20.00
     */
    PERCENTAGE,

    /**
     * Giảm giá một số tiền cố định (ví dụ: 50.000đ).
     * Giá trị (value) trong DB sẽ là 50000.00
     */
    FIXED_AMOUNT
}
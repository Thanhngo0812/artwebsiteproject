package com.ct08team.artbackendproject.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariantDTO {
    private String dimensions;
    private Double price;
    private Long stockQuantity;
}
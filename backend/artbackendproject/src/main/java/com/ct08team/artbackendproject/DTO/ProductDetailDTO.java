package com.ct08team.artbackendproject.DTO;

import java.math.BigDecimal;
import java.util.List;

public class ProductDetailDTO {
    public Long id;
    public String productName;
    public String productname;
    public String description;
    public String thumbnail;
    public BigDecimal minPrice;
    public List<CategoryDTO> categories;
    public List<VariantDTO> variants;
    public List<ImageDTO> images;
    public List<ColorDTO> colors;

    public static class CategoryDTO {
        public Long id;
        public String name;
        public CategoryDTO() {}
        public CategoryDTO(Long id, String name) { this.id = id; this.name = name; }
    }

    public static class VariantDTO {
        public Long id;
        public String dimensions;
        public Double price;
        public Long stockQuantity;
        public VariantDTO() {}
        public VariantDTO(Long id, String dimensions, Double price, Long stockQuantity) {
            this.id = id; this.dimensions = dimensions; this.price = price; this.stockQuantity = stockQuantity;
        }
    }

    public static class ImageDTO {
        public String imageUrl;
        public ImageDTO() {}
        public ImageDTO(String imageUrl) { this.imageUrl = imageUrl; }
    }

    public static class ColorDTO {
        public String hexCode;
        public ColorDTO() {}
        public ColorDTO(String hexCode) { this.hexCode = hexCode; }
    }
}
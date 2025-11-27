package com.ct08team.artbackendproject.DTO;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductUpdateDTO {
    private String productName;
    private String description;
    private String thumbnail;
    private Long materialId;
    private Integer productStatus;

    private List<CategoryRef> categories;
    private List<TopicRef> topics;
    private List<ColorRef> colors;

    private List<VariantUpdateDTO> variants;

    @Data
    public static class CategoryRef { private Long id; }
    @Data
    public static class TopicRef { private String topicName; }
    @Data
    public static class ColorRef { private String hexCode; }

    @Data
    public static class VariantUpdateDTO {
        private Long id; // Nếu null -> Tạo mới
        private String dimensions;
        private BigDecimal price;
        private List<ImageRef> images;
    }

    @Data
    public static class ImageRef { private String imageUrl; }
}
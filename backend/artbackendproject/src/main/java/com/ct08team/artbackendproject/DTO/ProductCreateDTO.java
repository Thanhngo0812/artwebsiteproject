package com.ct08team.artbackendproject.DTO;


import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

/**
 * DTO này dùng để map (ánh xạ) "part" JSON
 * từ request multipart/form-data.
 */
@Data // Dùng Lombok cho Getters/Setters
public class ProductCreateDTO {

    private String productName;
    private String description;
    private Long materialId;
    // productStatus đã bị xóa (mặc định là 0 trong Service)

    private List<CategoryRef> categories;
    private List<TopicRef> topics;
    private List<ColorRef> colors;
    private List<VariantCreateDTO> variants;

    // --- DTOs lồng nhau ---

    @Data
    public static class CategoryRef {
        private Long id;
    }

    @Data
    public static class TopicRef {
        private String topicName;
    }

    @Data
    public static class ColorRef {
        private String hexCode;
    }

    @Data
    public static class VariantCreateDTO {
        private String dimensions;
        private BigDecimal price;
        private BigDecimal costPrice;
        // stockQuantity đã bị xóa (mặc định là 0 trong Service)
        private Integer variantStatus;

        // MỚI: Dùng imageCount để map file
        private Integer imageCount;
    }

    // (Không cần ImageRef nữa vì chúng ta dùng imageCount)
}
package com.ct08team.artbackendproject.DTO;


import com.ct08team.artbackendproject.Entity.product.Product;
import com.ct08team.artbackendproject.Entity.product.ProductImage;
import com.ct08team.artbackendproject.Entity.product.ProductVariant;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class ProductAdminDetailDTO {
    private Long id;
    private String productName;
    private String description;
    private String thumbnail;
    private BigDecimal minPrice;
    private Integer productStatus;

    private MaterialDTO material;
    private List<CategoryDTO> categories;
    private List<VariantDTO> variants;
    private List<ColorDTO> colors;
    private List<TopicDTO> topics;

    public ProductAdminDetailDTO(Product p) {
        this.id = p.getId();
        this.productName = p.getProductName();
        this.description = p.getDescription();
        this.thumbnail = p.getThumbnail();
        this.minPrice = p.getMinPrice();
        this.productStatus = p.getProductStatus();

        if (p.getMaterial() != null) {
            this.material = new MaterialDTO(p.getMaterial().getId(), p.getMaterial().getMaterialName());
        }

        if (p.getCategories() != null) {
            this.categories = p.getCategories().stream()
                    .map(c -> new CategoryDTO(c.getId(), c.getName()))
                    .collect(Collectors.toList());
        }

        if (p.getVariants() != null) {
            this.variants = p.getVariants().stream()
                    .map(VariantDTO::new)
                    .collect(Collectors.toList());
        }

        if (p.getColors() != null) {
            this.colors = p.getColors().stream()
                    .map(c -> new ColorDTO(c.getHexCode()))
                    .collect(Collectors.toList());
        }

        if (p.getTopics() != null) {
            this.topics = p.getTopics().stream()
                    .map(t -> new TopicDTO(t.getTopicName()))
                    .collect(Collectors.toList());
        }
    }

    @Data
    public static class CategoryDTO {
        private Long id;
        private String name;
        public CategoryDTO(Long id, String name) { this.id = id; this.name = name; }
    }

    @Data
    public static class VariantDTO {
        private Long id;
        private String dimensions;
        private BigDecimal price;
        private BigDecimal costPrice; // <-- QUAN TRỌNG: Chỉ Admin mới thấy
        private Long stockQuantity;
        private List<ImageDTO> images;

        public VariantDTO(ProductVariant v) {
            this.id = v.getId();
            this.dimensions = v.getDimensions();
            this.price = v.getPrice();
            this.costPrice = v.getCostPrice(); // Map giá nhập
            this.stockQuantity = v.getStockQuantity();
            if (v.getImages() != null) {
                this.images = v.getImages().stream()
                        .map(img -> new ImageDTO(img.getImageUrl()))
                        .collect(Collectors.toList());
            }
        }
    }

    @Data
    public static class ImageDTO {
        private String imageUrl;
        public ImageDTO(String url) { this.imageUrl = url; }
    }

    @Data
    public static class ColorDTO {
        private String hexCode;
        public ColorDTO(String hex) { this.hexCode = hex; }
    }

    @Data
    public static class TopicDTO {
        private String topicName;
        public TopicDTO(String name) { this.topicName = name; }
    }

    @Data
    public static class MaterialDTO {
        private Long id;
        private String name;
        public MaterialDTO(Long id, String name) { this.id = id; this.name = name; }
    }
}

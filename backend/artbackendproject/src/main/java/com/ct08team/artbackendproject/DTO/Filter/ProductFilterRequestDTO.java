package com.ct08team.artbackendproject.DTO.Filter;

import java.math.BigDecimal;
import java.util.List;

// DTO này nhận yêu cầu lọc từ frontend
public class ProductFilterRequestDTO {
    private List<Long> categories;
    private List<Long> materials;
    private List<String> dimensions;
    private List<String> topics;
    private List<String> colors;
    private PriceRange price; // Lọc theo min/max

    // (Getters/Setters...)

    public List<Long> getMaterials() {
        return materials;
    }

    public void setMaterials(List<Long> materials) {
        this.materials = materials;
    }

    public PriceRange getPrice() {
        return price;
    }

    public void setPrice(PriceRange price) {
        this.price = price;
    }

    public List<String> getColors() {
        return colors;
    }

    public void setColors(List<String> colors) {
        this.colors = colors;
    }

    public List<String> getTopics() {
        return topics;
    }

    public void setTopics(List<String> topics) {
        this.topics = topics;
    }

    public List<String> getDimensions() {
        return dimensions;
    }

    public void setDimensions(List<String> dimensions) {
        this.dimensions = dimensions;
    }

    public List<Long> getCategories() {
        return categories;
    }

    public void setCategories(List<Long> categories) {
        this.categories = categories;
    }

    public static class PriceRange {
        private BigDecimal min;
        private BigDecimal max;
        // (Getters/Setters...)

        public BigDecimal getMin() {
            return min;
        }

        public void setMin(BigDecimal min) {
            this.min = min;
        }

        public BigDecimal getMax() {
            return max;
        }

        public void setMax(BigDecimal max) {
            this.max = max;
        }
    }
}

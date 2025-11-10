package com.ct08team.artbackendproject.DTO.Filter;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

// DTO này nhận yêu cầu lọc từ frontend
@Setter
@Getter
public class ProductFilterRequestDTO {
    private List<Long> categories;

    private List<Long> materials;
    private List<String> dimensions;
    private List<String> topics;
    private List<String> colors;
    private PriceRangeDTO priceRange; // Lọc theo min/max

    // (Getters/Setters...)

//    public PriceRangeDTO getPrice() {
//        return priceRange;
//    }
//
//    public List<String> getColors() {
//        return colors;
//    }
//
//    public List<String> getTopics() {
//        return topics;
//    }
//
//    public List<String> getDimensions() {
//        return dimensions;
//    }
//
//    public List<Long> getCategories() {
//        return categories;
//    }

    //    public static class PriceRange {
//        private BigDecimal min;
//        private BigDecimal max;
//        // (Getters/Setters...)
//
//        public BigDecimal getMin() {
//            return min;
//        }
//
//        public void setMin(BigDecimal min) {
//            this.min = min;
//        }
//
//        public BigDecimal getMax() {
//            return max;
//        }
//
//        public void setMax(BigDecimal max) {
//            this.max = max;
//        }
//    }
}

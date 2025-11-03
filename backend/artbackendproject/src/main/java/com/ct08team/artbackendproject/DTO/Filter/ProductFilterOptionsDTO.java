package com.ct08team.artbackendproject.DTO.Filter;

import java.util.List;

// DTO này chứa các tùy chọn lọc (để frontend vẽ ra sidebar)
public class ProductFilterOptionsDTO {
    private List<CategoryTreeDTO> categories; // Cây danh mục
    private List<MaterialDTO> materials;
    private PriceRangeDTO priceRange; // Min/Max của TOÀN BỘ sản phẩm
    private List<String> colors;
    private List<String> dimensions;
    private List<String> topics;

    // (Getters/Setters...)
    // (Cần có CategoryTreeDTO, MaterialDTO, PriceRangeDTO như đã code trước)

    public List<CategoryTreeDTO> getCategories() {
        return categories;
    }

    public void setCategories(List<CategoryTreeDTO> categories) {
        this.categories = categories;
    }

    public List<MaterialDTO> getMaterials() {
        return materials;
    }

    public void setMaterials(List<MaterialDTO> materials) {
        this.materials = materials;
    }

    public PriceRangeDTO getPriceRange() {
        return priceRange;
    }

    public void setPriceRange(PriceRangeDTO priceRange) {
        this.priceRange = priceRange;
    }

    public List<String> getColors() {
        return colors;
    }

    public void setColors(List<String> colors) {
        this.colors = colors;
    }

    public List<String> getDimensions() {
        return dimensions;
    }

    public void setDimensions(List<String> dimensions) {
        this.dimensions = dimensions;
    }

    public List<String> getTopics() {
        return topics;
    }

    public void setTopics(List<String> topics) {
        this.topics = topics;
    }
}
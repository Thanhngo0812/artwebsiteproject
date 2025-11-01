package com.ct08team.artbackendproject.DTO;

import java.math.BigDecimal;

/**
 * DTO (Data Transfer Object) này đại diện cho một sản phẩm
 * khi nó được hiển thị trong một danh sách hoặc lưới (grid).
 * Nó chỉ chứa các thông tin cần thiết để hiển thị,
 * giúp giảm tải dữ liệu truyền về cho frontend.
 */
public class ProductListDTO {

    private Long id;
    private String productName;
    private String thumbnail;

    // Sử dụng minPrice (giá thấp nhất) để hiển thị trong danh sách
    private BigDecimal minPrice;

    /**
     * Constructor rỗng
     * Bắt buộc phải có để Jackson (hoặc các thư viện khác) khởi tạo đối tượng
     */
    public ProductListDTO() {
    }

    /**
     * Constructor đầy đủ
     * Được sử dụng trong ProductService (hàm convertToProductListDTO)
     *
     * @param id          ID của sản phẩm
     * @param productName Tên sản phẩm
     * @param thumbnail   URL ảnh thumbnail
     * @param minPrice    Giá thấp nhất (lấy từ trường đã phi chuẩn hóa)
     */
    public ProductListDTO(Long id, String productName, String thumbnail, BigDecimal minPrice) {
        this.id = id;
        this.productName = productName;
        this.thumbnail = thumbnail;
        this.minPrice = minPrice;
    }

    // --- Getters and Setters ---
    // Bắt buộc phải có để Jackson có thể đọc và serialize
    // các trường private này thành JSON

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getThumbnail() {
        return thumbnail;
    }

    public void setThumbnail(String thumbnail) {
        this.thumbnail = thumbnail;
    }

    public BigDecimal getMinPrice() {
        return minPrice;
    }

    public void setMinPrice(BigDecimal minPrice) {
        this.minPrice = minPrice;
    }
}


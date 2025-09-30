package com.ct08team.artbackendproject.DTO;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

public class CategoryDTO {
    private Long id;

    @NotEmpty(message = "Tên danh mục không được để trống")
    @Size(min = 2, max = 100, message = "Tên danh mục phải từ 2 đến 100 ký tự")
    private String name;
    
    private Long parentId; 

    // BẮT BUỘC: Getters, Setters và Constructors
    public CategoryDTO() {}
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Long getParentId() { return parentId; }
    public void setParentId(Long parentId) { this.parentId = parentId; }
}
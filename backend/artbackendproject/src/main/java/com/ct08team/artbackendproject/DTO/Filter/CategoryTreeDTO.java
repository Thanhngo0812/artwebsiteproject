package com.ct08team.artbackendproject.DTO.Filter;

import java.util.ArrayList;
import java.util.List;

/**
 * DTO để biểu diễn một node trong cây danh mục.
 * Chứa ID, tên, và một danh sách các DTO con (children).
 */
public class CategoryTreeDTO {

    private Long id;
    private String name;

    // Luôn khởi tạo để tránh NullPointerException khi .add()
    private List<CategoryTreeDTO> children = new ArrayList<>();

    // Constructor rỗng (cần cho Jackson/JPA)
    public CategoryTreeDTO() {
    }

    // Constructor tiện lợi
    public CategoryTreeDTO(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    // --- Getters and Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<CategoryTreeDTO> getChildren() {
        return children;
    }

    public void setChildren(List<CategoryTreeDTO> children) {
        this.children = children;
    }
}
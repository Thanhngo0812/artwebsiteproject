package com.ct08team.artbackendproject.DTO.Filter;

import org.hibernate.annotations.Immutable;

/**
 * DTO đơn giản cho thông tin Chất liệu (Material).
 */
@Immutable
public class MaterialDTO {

    private Long id;
    private String materialname;

    // Constructor rỗng
    public MaterialDTO() {
    }

    // Constructor tiện lợi
    public MaterialDTO(Long id, String materialname) {
        this.id = id;
        this.materialname = materialname;
    }

    // --- Getters and Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMaterialname() {
        return materialname;
    }

    public void setMaterialname(String materialname) {
        this.materialname = materialname;
    }
}
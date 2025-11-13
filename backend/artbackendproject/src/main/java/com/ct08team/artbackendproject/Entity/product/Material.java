package com.ct08team.artbackendproject.Entity.product;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "material")
public class Material {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "materialname", unique = true, nullable = false)
    private String materialName;
    
    @OneToMany(mappedBy = "material", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore // <-- Thêm dòng này để ngắt đệ quy
    private List<Product> products = new ArrayList<>();
    
    public Material() {
    }
    
    public Material(Long id, String materialName) {
        this.id = id;
        this.materialName = materialName;
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getMaterialName() {
        return materialName;
    }
    
    public void setMaterialName(String materialName) {
        this.materialName = materialName;
    }
    
    public List<Product> getProducts() {
        return products;
    }
    
    public void setProducts(List<Product> products) {
        this.products = products;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Material material = (Material) o;
        return Objects.equals(id, material.id);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
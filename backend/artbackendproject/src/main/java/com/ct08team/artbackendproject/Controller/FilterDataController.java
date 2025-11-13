package com.ct08team.artbackendproject.Controller;


import com.ct08team.artbackendproject.DAO.CategoryRepository;
import com.ct08team.artbackendproject.DAO.MaterialRepository;
import com.ct08team.artbackendproject.Entity.product.Category;
import com.ct08team.artbackendproject.Entity.product.Material;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controller CHUNG để lấy dữ liệu cho các Dropdown/Filter
 * (Các API mà ProductAdmin.jsx gọi)
 */
@RestController
@RequestMapping("/api/v1")
public class FilterDataController {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private MaterialRepository materialRepository;

    /**
     * API: Lấy tất cả Danh mục
     */
    @GetMapping("/categories/all")
    public ResponseEntity<List<Category>> getAllCategories() {
        // TODO: Nên trả về DTO thay vì Entity
        return ResponseEntity.ok(categoryRepository.findAll());
    }

    @GetMapping("/categories/allparents")
    public ResponseEntity<List<Category>> getAllParentCategories() {
        // TODO: Nên trả về DTO thay vì Entity
        return ResponseEntity.ok(categoryRepository.findByParentIsNull());
    }

    /**
     * API: Lấy tất cả Chất liệu
     */
    @GetMapping("/materials/all")
    public ResponseEntity<List<Material>> getAllMaterials() {
        // TODO: Nên trả về DTO thay vì Entity
        return ResponseEntity.ok(materialRepository.findAll());
    }

}
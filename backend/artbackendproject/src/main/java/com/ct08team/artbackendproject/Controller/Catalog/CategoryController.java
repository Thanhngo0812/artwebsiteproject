package com.ct08team.artbackendproject.Controller.Catalog;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ct08team.artbackendproject.DTO.CategoryDTO;
import com.ct08team.artbackendproject.Entity.product.Category;
import com.ct08team.artbackendproject.Service.Catalog.CategoryService;

@RestController
@RequestMapping("/api/v1/categories")
public class CategoryController {
	private CategoryService categoryService;
	
	public CategoryController(CategoryService categoryService) {
		this.categoryService=categoryService;
	}
	
	
	
    /**
     * GET /api/v1/categories
     * Lấy tất cả danh mục
     */
    @GetMapping
    public ResponseEntity<List<CategoryDTO>> getAllCategories() {
//        List<CategoryDto> categories = categoryService.findAllCategories();
        // Trả về HTTP 200 OK
//        return ResponseEntity.ok(categories);
    	List<CategoryDTO> categories = categoryService.getAllCategories();
    	return ResponseEntity.ok(categories);
    }
    
    
 // GET /api/v1/categories/parents
    @GetMapping("/parents")
    public ResponseEntity<List<CategoryDTO>> getCategoriesParent() {
//        List<CategoryDto> categories = categoryService.findAllCategories();
        // Trả về HTTP 200 OK
//        return ResponseEntity.ok(categories);
    	List<CategoryDTO> categories = categoryService.getCategoriesParent();
    	return ResponseEntity.ok(categories);
    }
    
 // GET /api/v1/categories/{parentId}/children
    @GetMapping("/{parentId}/children")
    public ResponseEntity<List<CategoryDTO>> getCategoriesByParent(@PathVariable int parentId) {
//        List<CategoryDto> categories = categoryService.findAllCategories();
        // Trả về HTTP 200 OK
//        return ResponseEntity.ok(categories);
    	List<CategoryDTO> categories = categoryService.getAllCategoriesByParent(parentId);
    	return ResponseEntity.ok(categories);
    }
}

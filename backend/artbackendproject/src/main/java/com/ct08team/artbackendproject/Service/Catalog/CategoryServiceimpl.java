package com.ct08team.artbackendproject.Service.Catalog;

import com.ct08team.artbackendproject.DTO.CategoryDTO;
import com.ct08team.artbackendproject.mapper.CategoryMapper;
import com.ct08team.artbackendproject.DAO.CategoryRepository; // Import repository thay vì DAO
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Dùng @Transactional của Spring

import java.util.List;

@Service
public class CategoryServiceimpl implements CategoryService {

    // 1. Thay thế CategoryDAO bằng CategoryRepository
    private final CategoryRepository categoryRepository;

    @Autowired
    public CategoryServiceimpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    @Transactional(readOnly = true) // Thêm readOnly = true để tối ưu cho các tác vụ chỉ đọc
    public List<CategoryDTO> getAllCategories() {
        // 2. Thay categoryDAO.getAllCategories() bằng categoryRepository.findAll()
        return CategoryMapper.mapToDtoList(categoryRepository.findAll());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryDTO> getCategoriesParent() {
        // 3. Thay categoryDAO.getCategoriesParent() bằng categoryRepository.findByParentIsNull()
        return CategoryMapper.mapToDtoList(categoryRepository.findByParentIsNull());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryDTO> getAllCategoriesByParent(Long parentId) { // Nên đổi thành Long để khớp với kiểu ID
        // 4. Thay categoryDAO.getAllCategoriesByParent(parentId) bằng categoryRepository.findByParentId(parentId)
        return CategoryMapper.mapToDtoList(categoryRepository.findByParentId(parentId));
    }
}
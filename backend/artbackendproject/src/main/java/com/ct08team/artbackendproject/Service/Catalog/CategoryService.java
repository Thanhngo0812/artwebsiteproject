package com.ct08team.artbackendproject.Service.Catalog;

import com.ct08team.artbackendproject.DTO.CategoryDTO;
import java.util.List;

public interface CategoryService {

    List<CategoryDTO> getAllCategories();

    List<CategoryDTO> getCategoriesParent();

    // Thay đổi duy nhất: int -> Long để đồng bộ với kiểu ID của Entity
    List<CategoryDTO> getAllCategoriesByParent(Long parentId);

}
package com.ct08team.artbackendproject.Service.Catalog;

import java.util.List;

import com.ct08team.artbackendproject.DTO.CategoryDTO;

public interface CategoryService {
	public List<CategoryDTO> getAllCategories();
	public List<CategoryDTO> getCategoriesParent();
	public List<CategoryDTO> getAllCategoriesByParent(int parentId);


}

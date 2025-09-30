package com.ct08team.artbackendproject.Service.Catalog;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ct08team.artbackendproject.mapper.CategoryMapper; 

import com.ct08team.artbackendproject.DAO.Catalog.CategoryDAO;
import com.ct08team.artbackendproject.DTO.CategoryDTO;
import com.ct08team.artbackendproject.Entity.Category;

import jakarta.transaction.Transactional;

@Service
public class CategoryServiceimpl implements CategoryService {


	 private CategoryDAO categoryDAO;
	 	@Autowired
	  public CategoryServiceimpl(CategoryDAO categoryDAO) {
	        this.categoryDAO = categoryDAO;
	    }

	    @Override
	    @Transactional
	    public List<CategoryDTO> getAllCategories() {
	        return CategoryMapper.mapToDtoList(categoryDAO.getAllCategories());
	    }

		@Override
		public List<CategoryDTO> getCategoriesParent() {
			return CategoryMapper.mapToDtoList(categoryDAO.getCategoriesParent());
		}

		@Override
		public List<CategoryDTO> getAllCategoriesByParent(int parentId) {
			 return CategoryMapper.mapToDtoList(categoryDAO.getAllCategoriesByParent(parentId));
		}
}

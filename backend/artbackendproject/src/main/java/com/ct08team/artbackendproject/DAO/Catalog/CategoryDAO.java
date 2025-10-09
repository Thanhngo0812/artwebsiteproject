package com.ct08team.artbackendproject.DAO.Catalog;

import org.springframework.stereotype.Repository;

import com.ct08team.artbackendproject.Entity.product.Category;

import java.util.List;


@Repository 
public interface CategoryDAO {
	public List<Category> getAllCategories();
	public List<Category> getCategoriesParent();
	public List<Category> getAllCategoriesByParent(int parentId);
}
package com.ct08team.artbackendproject.DAO.Catalog;

import com.ct08team.artbackendproject.Entity.Category;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository 
public interface CategoryDAO {
	public List<Category> getAllCategories();
	public List<Category> getCategoriesParent();
	public List<Category> getAllCategoriesByParent(int parentId);
}
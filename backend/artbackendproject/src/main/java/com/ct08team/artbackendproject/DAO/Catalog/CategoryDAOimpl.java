package com.ct08team.artbackendproject.DAO.Catalog;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.ct08team.artbackendproject.Entity.product.Category;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
@Repository
public class CategoryDAOimpl implements CategoryDAO {
	private EntityManager entityManager;

	@Autowired
	public CategoryDAOimpl(EntityManager entityManager) {
	    this.entityManager = entityManager;
	}
	@Override
	public List<Category> getAllCategories() {
		String jpql="SELECT c FROM Category c";
		TypedQuery<Category> query = entityManager.createQuery(jpql, Category.class);
		List<Category> categories = query.getResultList();
		return categories;
	}
	@Override
	public List<Category> getCategoriesParent() {
		String jpql="SELECT c FROM Category c WHERE c.parent is NULL";
		TypedQuery<Category> query = entityManager.createQuery(jpql, Category.class);
		List<Category> categories = query.getResultList();
		return categories;
	}
	@Override
	public List<Category> getAllCategoriesByParent(int parentId) {
		String jpql="SELECT c FROM Category c WHERE c.parent.id = :parentId";
		TypedQuery<Category> query = entityManager.createQuery(jpql, Category.class);
	    query.setParameter("parentId", parentId); // Đảm bảo "parentId" khớp với :parentId trong JPQL
		List<Category> categories = query.getResultList();
		return categories;
	}

}

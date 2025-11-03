package com.ct08team.artbackendproject.DAO;


import com.ct08team.artbackendproject.Entity.product.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    @Override
    @Query("SELECT c FROM Category c LEFT JOIN FETCH c.parent")
    List<Category> findAll();
    /**
     * Thay thế cho: getCategoriesParent()
     * Spring Data JPA sẽ tự động tạo query "WHERE parent IS NULL"
     * dựa vào tên phương thức.
     */
    List<Category> findByParentIsNull();

    /**
     * Thay thế cho: getAllCategoriesByParent(int parentId)
     * Tự động tạo query "WHERE parent.id = ?1"
     * Lưu ý: "ParentId" trong tên phương thức tương ứng với thuộc tính "id"
     * bên trong đối tượng "parent" của Entity Category.
     *
     * @param parentId ID của category cha cần tìm các category con.
     * @return Danh sách các category con.
     */
    List<Category> findByParentId(Long parentId);

    // Phương thức getAllCategories() đã có sẵn trong JpaRepository với tên là findAll()
}
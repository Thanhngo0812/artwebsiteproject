package com.ct08team.artbackendproject.DAO;

import java.util.List;
import java.util.Optional;

import com.ct08team.artbackendproject.DTO.Filter.MaterialDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ct08team.artbackendproject.Entity.product.Material;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Long> {
    Optional<Material> findByMaterialName(String materialName);
    boolean existsByMaterialName(String materialName);
    // --- HÀM BỊ THIẾU ---
    /**
     * Tìm các chất liệu DTO duy nhất từ một danh sách ID sản phẩm.
     * Chúng ta trả về DTO luôn cho tiện.
     */
    @Query("SELECT new com.ct08team.artbackendproject.DTO.Filter.MaterialDTO(m.id, m.materialName) " +
            "FROM Material m " +
            "WHERE m.id IN (" +
            "   SELECT p.material.id FROM Product p WHERE p.id IN :productIds" +
            ")")
    List<MaterialDTO> findDistinctMaterialsByProductIds(@Param("productIds") List<Long> productIds);
}
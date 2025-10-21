package com.ct08team.artbackendproject.DAO;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ct08team.artbackendproject.Entity.product.Material;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Long> {
    Optional<Material> findByMaterialName(String materialName);
    boolean existsByMaterialName(String materialName);
}
package com.ct08team.artbackendproject.DAO.Inventory;

import com.ct08team.artbackendproject.Entity.inventory.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {
}
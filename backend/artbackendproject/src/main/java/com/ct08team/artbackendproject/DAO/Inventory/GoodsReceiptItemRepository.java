package com.ct08team.artbackendproject.DAO.Inventory;

import com.ct08team.artbackendproject.Entity.inventory.GoodsReceiptItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GoodsReceiptItemRepository extends JpaRepository<GoodsReceiptItem, Long> {
}
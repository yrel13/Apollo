package com.apollo.logistics.inventory.repository;
import com.apollo.logistics.inventory.entity.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface InventoryRepository extends JpaRepository<InventoryItem, Long> {
    
    @Query("SELECT SUM(i.quantity * i.unitPrice) FROM InventoryItem i")
    Double getTotalInventoryValue();
    
    @Query("SELECT COUNT(i) FROM InventoryItem i WHERE i.quantity < i.reorderPoint")
    long countLowStockItems();
}

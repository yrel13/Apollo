package com.apollo.logistics.inventory.repository;
import com.apollo.logistics.inventory.entity.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
public interface InventoryRepository extends JpaRepository<InventoryItem, Long> { }

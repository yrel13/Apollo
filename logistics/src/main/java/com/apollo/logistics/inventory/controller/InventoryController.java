package com.apollo.logistics.inventory.controller;

import org.springframework.web.bind.annotation.*;
import com.apollo.logistics.inventory.repository.InventoryRepository;
import com.apollo.logistics.inventory.entity.InventoryItem;
import com.apollo.logistics.inventory.dto.InventoryItemDTO;
import com.apollo.logistics.inventory.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {
    
    private final InventoryRepository repo;
    private final InventoryService inventoryService;

    @GetMapping
    public ResponseEntity<Page<InventoryItemDTO>> list(Pageable pageable) {
        return ResponseEntity.ok(inventoryService.getItems(pageable));
    }

    @PostMapping
    public ResponseEntity<InventoryItem> create(@RequestBody InventoryItem it) {
        return ResponseEntity.ok(repo.save(it));
    }

    @PutMapping("{id}")
    public ResponseEntity<InventoryItem> update(@PathVariable Long id, @RequestBody InventoryItem it) {
        it.setId(id);
        return ResponseEntity.ok(repo.save(it));
    }

    @DeleteMapping("{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        repo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}

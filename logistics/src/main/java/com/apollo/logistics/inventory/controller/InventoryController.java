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
import org.springframework.security.access.prepost.PreAuthorize;
import jakarta.validation.Valid;
import java.util.List;
import com.apollo.logistics.common.audit.AuditLogger;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {
    
    private final InventoryRepository repo;
    private final InventoryService inventoryService;
    private final AuditLogger auditLogger;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<Page<InventoryItemDTO>> list(Pageable pageable) {
        return ResponseEntity.ok(inventoryService.getItems(pageable));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<InventoryItem> create(@Valid @RequestBody InventoryItem it, Authentication auth) {
        var saved = repo.save(it);
        auditLogger.adminAction(auth.getName(), "CREATE", "InventoryItem", saved.getId());
        return ResponseEntity.ok(saved);
    }

    @PutMapping("{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<InventoryItem> update(@PathVariable Long id, @Valid @RequestBody InventoryItem it, Authentication auth) {
        it.setId(id);
        var saved = repo.save(it);
        auditLogger.adminAction(auth.getName(), "UPDATE", "InventoryItem", saved.getId());
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Long id, Authentication auth) {
        repo.deleteById(id);
        auditLogger.adminAction(auth.getName(), "DELETE", "InventoryItem", id);
        return ResponseEntity.ok().build();
    }
}

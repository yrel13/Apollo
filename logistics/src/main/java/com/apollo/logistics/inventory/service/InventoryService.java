package com.apollo.logistics.inventory.service;

import com.apollo.logistics.inventory.dto.InventoryItemDTO;
import com.apollo.logistics.inventory.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    public List<InventoryItemDTO> getAllItems() {
        return inventoryRepository.findAll()
                .stream()
                .map(item -> new InventoryItemDTO(
                        item.getId(),
                        item.getName(),
                        item.getSku(),
                        item.getQuantity(),
                        item.getReorderPoint(),
                        getStatus(item.getQuantity(), item.getReorderPoint())
                ))
                .collect(Collectors.toList());
    }

    private String getStatus(int quantity, int reorderPoint) {
        if (quantity < reorderPoint / 2) return "Critical";
        if (quantity < reorderPoint) return "Low";
        return "Adequate";
    }
}

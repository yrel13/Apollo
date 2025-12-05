package com.apollo.logistics.inventory.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class InventoryItemDTO {
    private Long id;
    private String name;
    private String sku;
    private int stock;
    private int reorderLevel;
    private String status;
}

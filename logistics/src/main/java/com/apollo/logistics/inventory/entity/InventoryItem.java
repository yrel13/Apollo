package com.apollo.logistics.inventory.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Table(name="inventory_items")
public class InventoryItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    private String name;
    private String sku;
    private Integer quantity;
    private Integer reorderPoint;
    private Double unitPrice;
}

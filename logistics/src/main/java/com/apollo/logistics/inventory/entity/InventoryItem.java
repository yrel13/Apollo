package com.apollo.logistics.inventory.entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Table(name="inventory_items")
public class InventoryItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;

    @NotBlank(message = "Name is required")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "SKU is required")
    @Column(nullable = false, unique = true)
    private String sku;

    @NotNull(message = "Quantity is required")
    @Min(value = 0, message = "Quantity cannot be negative")
    @Column(nullable = false)
    private Integer quantity;

    @NotNull(message = "Reorder point is required")
    @Min(value = 0, message = "Reorder point cannot be negative")
    @Column(nullable = false)
    private Integer reorderPoint;

    @NotNull(message = "Unit price is required")
    @Min(value = 0, message = "Unit price cannot be negative")
    @Column(nullable = false)
    private Double unitPrice;
}

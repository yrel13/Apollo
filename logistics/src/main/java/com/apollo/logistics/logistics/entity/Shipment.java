package com.apollo.logistics.logistics.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "shipments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Shipment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String orderNumber;
    
    @Column(nullable = false)
    private String destination;
    
    @Column(nullable = false)
    private String status; // In Transit, Delivered, Delayed, Processing
    
    private LocalDateTime eta;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @PrePersist
    public void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }
    
    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

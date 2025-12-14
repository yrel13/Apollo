package com.apollo.logistics.common.audit;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.Instant;

@Entity
@Table(name = "audit_events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuditEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String action; // CREATE / UPDATE / DELETE

    @Column(nullable = false)
    private String resource; // InventoryItem / Shipment

    @Column(nullable = false)
    private String details; // e.g. ID

    @Column(nullable = false)
    private Instant at;
}

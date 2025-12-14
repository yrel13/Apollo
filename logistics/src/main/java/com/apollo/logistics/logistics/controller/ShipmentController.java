package com.apollo.logistics.logistics.controller;

import com.apollo.logistics.logistics.dto.ShipmentDTO;
import com.apollo.logistics.logistics.entity.Shipment;
import com.apollo.logistics.logistics.service.ShipmentService;
import com.apollo.logistics.logistics.repository.ShipmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import com.apollo.logistics.common.audit.AuditLogger;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/shipments")
@RequiredArgsConstructor
public class ShipmentController {
    
    private final ShipmentService shipmentService;
    private final ShipmentRepository shipmentRepository;
    private final AuditLogger auditLogger;
    
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<Page<ShipmentDTO>> getAllShipments(Pageable pageable) {
        return ResponseEntity.ok(shipmentService.getShipments(pageable));
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Shipment> createShipment(@Valid @RequestBody Shipment shipment, Authentication auth) {
        var saved = shipmentRepository.save(shipment);
        auditLogger.adminAction(auth.getName(), "CREATE", "Shipment", saved.getId());
        return ResponseEntity.ok(saved);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Shipment> updateShipment(@PathVariable Long id, @Valid @RequestBody Shipment shipment, Authentication auth) {
        shipment.setId(id);
        var saved = shipmentRepository.save(shipment);
        auditLogger.adminAction(auth.getName(), "UPDATE", "Shipment", saved.getId());
        return ResponseEntity.ok(saved);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteShipment(@PathVariable Long id, Authentication auth) {
        shipmentRepository.deleteById(id);
        auditLogger.adminAction(auth.getName(), "DELETE", "Shipment", id);
        return ResponseEntity.ok().build();
    }
}

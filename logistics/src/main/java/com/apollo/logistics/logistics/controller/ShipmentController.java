package com.apollo.logistics.logistics.controller;

import com.apollo.logistics.logistics.dto.ShipmentDTO;
import com.apollo.logistics.logistics.entity.Shipment;
import com.apollo.logistics.logistics.service.ShipmentService;
import com.apollo.logistics.logistics.repository.ShipmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/shipments")
@RequiredArgsConstructor
public class ShipmentController {
    
    private final ShipmentService shipmentService;
    private final ShipmentRepository shipmentRepository;
    
    @GetMapping
    public ResponseEntity<Page<ShipmentDTO>> getAllShipments(Pageable pageable) {
        return ResponseEntity.ok(shipmentService.getShipments(pageable));
    }
    
    @PostMapping
    public ResponseEntity<Shipment> createShipment(@RequestBody Shipment shipment) {
        return ResponseEntity.ok(shipmentRepository.save(shipment));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Shipment> updateShipment(@PathVariable Long id, @RequestBody Shipment shipment) {
        shipment.setId(id);
        return ResponseEntity.ok(shipmentRepository.save(shipment));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteShipment(@PathVariable Long id) {
        shipmentRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}

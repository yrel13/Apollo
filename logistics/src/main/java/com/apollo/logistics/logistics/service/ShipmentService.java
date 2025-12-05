package com.apollo.logistics.logistics.service;

import com.apollo.logistics.logistics.dto.ShipmentDTO;
import com.apollo.logistics.logistics.repository.ShipmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShipmentService {
    
    private final ShipmentRepository shipmentRepository;
    
    public List<ShipmentDTO> getAllShipments() {
        return shipmentRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    private ShipmentDTO convertToDTO(com.apollo.logistics.logistics.entity.Shipment shipment) {
        int delayDays = 0;
        if (shipment.getEta() != null && shipment.getStatus().equals("Delayed")) {
            delayDays = (int) ChronoUnit.DAYS.between(shipment.getEta(), LocalDateTime.now());
        }
        
        return new ShipmentDTO(
                shipment.getId(),
                shipment.getOrderNumber(),
                shipment.getDestination(),
                shipment.getStatus(),
                shipment.getEta(),
                delayDays
        );
    }
}

package com.apollo.logistics.logistics.repository;

import com.apollo.logistics.logistics.entity.Shipment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ShipmentRepository extends JpaRepository<Shipment, Long> {
    
    @Query("SELECT COUNT(s) FROM Shipment s WHERE s.status IN ('Processing', 'In Transit')")
    long countPendingShipments();
}

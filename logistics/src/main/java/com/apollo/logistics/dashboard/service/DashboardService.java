package com.apollo.logistics.dashboard.service;

import com.apollo.logistics.dashboard.dto.KPIResponse;
import com.apollo.logistics.inventory.repository.InventoryRepository;
import com.apollo.logistics.logistics.repository.ShipmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final InventoryRepository inventoryRepository;
    private final ShipmentRepository shipmentRepository;

    public KPIResponse getKPIs() {
        // Calculate total inventory value
        double inventoryValue = inventoryRepository.getTotalInventoryValue();

        // Count low stock items
        int lowStockItems = (int) inventoryRepository.countLowStockItems();

        // Count pending shipments
        int pendingShipments = (int) shipmentRepository.countPendingShipments();

        // Forecast accuracy (placeholder - update with actual ML model)
        double forecastAccuracy = 92.4;

        return new KPIResponse(inventoryValue, lowStockItems, pendingShipments, forecastAccuracy);
    }
}

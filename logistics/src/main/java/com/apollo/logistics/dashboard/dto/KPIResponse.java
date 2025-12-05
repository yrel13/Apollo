package com.apollo.logistics.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class KPIResponse {
    private double inventoryValue;
    private int lowStockItems;
    private int pendingShipments;
    private double forecastAccuracy;
}

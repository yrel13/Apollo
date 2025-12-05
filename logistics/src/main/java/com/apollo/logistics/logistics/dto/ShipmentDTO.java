package com.apollo.logistics.logistics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ShipmentDTO {
    private Long id;
    private String orderNumber;
    private String destination;
    private String status;
    private LocalDateTime eta;
    private int delayDays;
}

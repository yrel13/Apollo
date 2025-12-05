package com.apollo.logistics.dashboard.controller;

import com.apollo.logistics.dashboard.dto.KPIResponse;
import com.apollo.logistics.dashboard.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/kpis")
    public ResponseEntity<KPIResponse> getKPIs() {
        return ResponseEntity.ok(dashboardService.getKPIs());
    }
}

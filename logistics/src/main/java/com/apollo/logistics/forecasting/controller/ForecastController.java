package com.apollo.logistics.forecasting.controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.reactive.function.client.WebClient;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/forecasting")
public class ForecastController {
    private final WebClient client;
    
    public ForecastController(WebClient.Builder b) {
        this.client = b.baseUrl("http://localhost:8000").build();
    }

    @PostMapping("/generate")
    public ResponseEntity<?> generateForecast(@RequestBody Map<String, Object> body) {
        try {
            // Extract parameters
            String product = (String) body.getOrDefault("product", "unknown");
            Integer forecastPeriod = (Integer) body.getOrDefault("forecastPeriod", 90);
            
            // Map product SKU to ID (simple hash for demo)
            long productId = Math.abs(product.hashCode()) % 1000;
            
            Map<String, Object> request = new HashMap<>();
            request.put("product_id", productId);
            request.put("forecast_days", forecastPeriod);
            
            var resp = client.post()
                .uri("/forecast")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(Map.class)
                .block();
            
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(Map.of("error", "Failed to generate forecast: " + e.getMessage()));
        }
    }
    
    @GetMapping("/list")
    public ResponseEntity<?> listForecasts() {
        // Return sample forecasts for display
        return ResponseEntity.ok(java.util.List.of(
            Map.of("product", "MOD-PMP-100", "expectedDemand", 1850, "optimalInventory", 2200, "reorderPoint", 1500, "accuracy", 92),
            Map.of("product", "MOD-VLV-200", "expectedDemand", 1200, "optimalInventory", 1400, "reorderPoint", 900, "accuracy", 88),
            Map.of("product", "MOD-CTL-300", "expectedDemand", 950, "optimalInventory", 1100, "reorderPoint", 700, "accuracy", 90)
        ));
    }
}

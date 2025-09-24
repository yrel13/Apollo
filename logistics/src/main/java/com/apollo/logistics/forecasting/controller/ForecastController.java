package com.apollo.logistics.forecasting.controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.reactive.function.client.WebClient;
import java.util.Map;

@RestController
@RequestMapping("/api/forecast")
public class ForecastController {
    private final WebClient client;
    public ForecastController(WebClient.Builder b){ this.client = b.baseUrl("http://localhost:8000").build(); }

    @PostMapping("/product/{id}")
    public ResponseEntity<?> forecast(@PathVariable Long id, @RequestBody Map<String,Object> body){
        // Proxy to Python FastAPI
        var resp = client.post().uri("/forecast")
            .bodyValue(Map.of("product_id", id, "start_date", body.get("start_date"), "end_date", body.get("end_date")))
            .retrieve().bodyToMono(Map.class).block();
        return ResponseEntity.ok(resp);
    }
}

package com.apollo.logistics.aiassistant.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.reactive.function.client.WebClient;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {
    private final WebClient client;
    
    public ChatController(WebClient.Builder b) {
        this.client = b.baseUrl("http://localhost:8000").build();
    }

    @PostMapping
    public ResponseEntity<?> chat(@RequestBody Map<String, Object> body) {
        try {
            var resp = client.post()
                .uri("/chat")
                .bodyValue(Map.of("message", body.get("message")))
                .retrieve()
                .bodyToMono(Map.class)
                .block();
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("reply", "AI service is currently unavailable. Please try again later."));
        }
    }
}

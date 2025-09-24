package com.apollo.logistics.auth.controller;
import com.apollo.logistics.auth.dto.LoginRequest;
import com.apollo.logistics.auth.service.AuthService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService auth;
    public AuthController(AuthService auth){ this.auth = auth; }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req){
        try { Map<String,String> res = auth.login(req); return ResponseEntity.ok(res); }
        catch (RuntimeException e) { return ResponseEntity.status(401).body(Map.of("error", e.getMessage())); }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String,String> body){
        // simple admin-protected registration will be added later
        auth.register(body.get("username"), body.get("email"), body.get("password"), body.getOrDefault("role","STAFF"));
        return ResponseEntity.ok(Map.of("status","ok"));
    }
}

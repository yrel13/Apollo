package com.apollo.logistics.auth.service;

import com.apollo.logistics.auth.dto.AuthRequest;
import com.apollo.logistics.auth.dto.AuthResponse;
import com.apollo.logistics.auth.dto.RegisterRequest;
import com.apollo.logistics.auth.entity.User;
import com.apollo.logistics.auth.repository.UserRepository;
import com.apollo.logistics.common.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse login(AuthRequest req) {

        User user = userRepo.findByUsername(req.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        // Generate token with username + role
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());

        // Return ALL required fields (token, username, role)
        return new AuthResponse(token, user.getUsername(), user.getRole());
    }

    public String register(RegisterRequest req) {

        if (userRepo.existsByUsername(req.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        User user = new User();
        user.setUsername(req.getUsername());
        user.setFirstname(req.getFirstname());
        user.setLastname(req.getLastname());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole(req.getRole());

        userRepo.save(user);

        return "User registered successfully!";
    }
}

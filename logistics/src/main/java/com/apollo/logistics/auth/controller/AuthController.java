package com.apollo.logistics.auth.controller;

import com.apollo.logistics.auth.dto.AuthRequest;
import com.apollo.logistics.auth.dto.RegisterRequest;
import com.apollo.logistics.auth.dto.StatusResponse;
import com.apollo.logistics.auth.dto.ErrorResponse;
import com.apollo.logistics.auth.dto.UserDTO;
import com.apollo.logistics.auth.service.AuthService;
import com.apollo.logistics.auth.repository.UserRepository;
import com.apollo.logistics.auth.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest req) {
        try {
            return ResponseEntity.ok(authService.login(req));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Login failed", e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        try {
            authService.register(req);
            return ResponseEntity.ok(new StatusResponse("User registered successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("Registration failed", e.getMessage()));
        }
    }

        @GetMapping("/users")
        public ResponseEntity<Page<UserDTO>> getAllUsers(Pageable pageable) {
        var page = userRepository.findAll(pageable);
        List<UserDTO> users = page.getContent()
            .stream()
            .map(user -> new UserDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                "Active",
                user.getCreatedat()
            ))
            .collect(Collectors.toList());
        return ResponseEntity.ok(new PageImpl<>(users, pageable, page.getTotalElements()));
        }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User user) {
        try {
            user.setId(id);
            userRepository.save(user);
            return ResponseEntity.ok(new StatusResponse("User updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("Update failed", e.getMessage()));
        }
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userRepository.deleteById(id);
            return ResponseEntity.ok(new StatusResponse("User deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("Delete failed", e.getMessage()));
        }
    }
}

package com.apollo.logistics.auth.service;
import com.apollo.logistics.auth.dto.LoginRequest;
import com.apollo.logistics.auth.entity.User;
import com.apollo.logistics.auth.repository.UserRepository;
import com.apollo.logistics.common.util.JwtUtil;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Map;

@Service
public class AuthService {
    private final UserRepository repo; private final PasswordEncoder encoder; private final JwtUtil jwt;
    public AuthService(UserRepository repo, PasswordEncoder encoder, JwtUtil jwt){ this.repo=repo;this.encoder=encoder;this.jwt=jwt; }

    public Map<String,String> login(LoginRequest req){
        User user = repo.findByUsername(req.getUsername()).orElseThrow(()->new RuntimeException("User not found"));
        if (!encoder.matches(req.getPassword(), user.getPassword())) throw new RuntimeException("Invalid credentials");
        return Map.of("token", jwt.generateToken(user.getUsername()), "role", user.getRole());
    }

    public void register(String username, String email, String rawPassword, String role){
        if (repo.existsByUsername(username)) throw new RuntimeException("username exists");
        User u = User.builder().username(username).email(email).password(encoder.encode(rawPassword)).role(role).build();
        repo.save(u);
    }
}

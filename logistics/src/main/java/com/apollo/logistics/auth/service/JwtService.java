// package com.apollo.logistics.auth.service;

// import org.springframework.stereotype.Service;
// import com.apollo.logistics.auth.entity.User;
// import io.jsonwebtoken.*;

// import java.util.Date;

// @Service
// public class JwtService {
//     private final String SECRET_KEY = "__";
    
//     public String generateToken(User user) {
//         return Jwts.builder()
//             .setSubject(user.getEmail())
//             .claim("role", user.getRole())
//             .claim("username", user.getUsername())
//             .setIssuedAt(new Date())
//             .setExpiration(new Date(System.currentTimeMillis() + 3600_000))
//             .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
//             .compact();
//     }

//     public String extractEmail(String token) {
//         return extractAllClaims(token).getSubject();
//     }

//     public boolean isTokenValid(String token, User user) {
//         return user.getEmail().equals(extractEmail(token)) && !isTokenExpired(token);
//     }

//     private boolean isTokenExpired(String token) {
//         return extractAllClaims(token).getExpiration().before(new Date());
//     }

//     private Claims extractAllClaims(String token) {
//         return Jwts.parser()
//             .setSigningKey(SECRET_KEY)
//             .parseClaimsJws(token)
//             .getBody();
//     }
// }

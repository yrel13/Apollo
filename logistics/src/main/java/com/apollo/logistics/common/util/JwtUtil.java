package com.apollo.logistics.common.util;

import io.jsonwebtoken.*;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.security.Keys;

import java.util.Date;

@Component
public class JwtUtil {
    private final String SECRET = "THIS_IS_A_VERY_LONG_SECRET_KEY_32+_CHARS_LONG";
    private final long EXPIRATION = 1000 * 60 * 60 * 10; //10 hrs

    public String generateToken(String username) {
        return Jwts.builder()
            .setSubject(username)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
            .signWith(Keys.hmacShaKeyFor(SECRET.getBytes()))
            .compact();
    }

    public boolean validate(String token) {
        try {
            extractAllClaims(token);
            return true;
        }   catch (Exception e) {
            return false;
        }
    }

    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
            .setSigningKey(Keys.hmacShaKeyFor(SECRET.getBytes()))
            .build()
            .parseClaimsJws(token)
            .getBody();
    }
}

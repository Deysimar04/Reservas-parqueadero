package com.reservas.parqueaderos.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private final Key key;

    // 🔐 Clave desde properties
    public JwtUtil(@Value("${jwt.secret}") String secret) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
    }

    // ✅ Generar token
    public String generateToken(String username, String role) {
        // 24 horas
        long EXPIRATION = 86400000;
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(key)
                .compact();
    }

    // ✅ Extraer username
    public String extractUsername(String token) {
        return getClaims(token).getSubject();
    }

    // ✅ Extraer rol
    public String extractRole(String token) {
        return getClaims(token).get("role", String.class);
    }

    // ✅ Validar token
    public boolean isTokenValid(String token) {
        try {
            getClaims(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }

    // 🔍 Obtener claims
    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
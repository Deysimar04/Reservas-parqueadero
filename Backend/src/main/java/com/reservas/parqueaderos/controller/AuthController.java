package com.reservas.parqueaderos.controller;

import com.reservas.parqueaderos.model.User;
import com.reservas.parqueaderos.repository.UserRepository;
import com.reservas.parqueaderos.security.JwtUtil;
import com.reservas.parqueaderos.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final AuthService authService;

    // LOGIN CORREGIDO
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        return userRepository.findByUsername(username)
                .map(user -> {
                    if (passwordEncoder.matches(password, user.getPassword())) {

                        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());

                        return ResponseEntity.ok(Map.of(
                                "token", token,
                                "role", user.getRole(),
                                "username", user.getUsername()
                        ));
                    }
                    return ResponseEntity.status(401).body(Map.of("error", "Contraseña incorrecta"));
                })
                .orElse(ResponseEntity.status(401).body(Map.of("error", "Usuario no encontrado")));
    }

    // REGISTRO
    @PostMapping("/registro")
    public ResponseEntity<?> registro(@RequestBody User user) {
        user.setRole("USER");
        String resultado = authService.registrar(user);

        if (resultado.startsWith("Error")) {
            return ResponseEntity.badRequest().body(Map.of("error", resultado));
        }
        return ResponseEntity.ok(Map.of("mensaje", resultado));
    }

    // LOGOUT
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok(Map.of("mensaje", "Sesión cerrada"));
    }
}
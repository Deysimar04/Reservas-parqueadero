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

    // TEMPORAL — generar hash, eliminar después
    @GetMapping("/hash/{password}")
    public ResponseEntity<?> generarHash(@PathVariable String password) {
        return ResponseEntity.ok(Map.of("hash", passwordEncoder.encode(password)));
    }

    // HU14: Login
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

    // HU13: Registro
    @PostMapping("/registro")
    public ResponseEntity<?> registro(@RequestBody User user) {
        if (user.getUsername() == null || user.getUsername().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "El username es obligatorio"));
        }
        if (user.getEmail() == null || user.getEmail().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "El email es obligatorio"));
        }
        if (user.getPassword() == null || user.getPassword().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "La contraseña es obligatoria"));
        }

        // Respetar el rol que llega, si no viene usar USER por defecto
        if (user.getRole() == null || user.getRole().isBlank()) {
            user.setRole("USER");
        }

        String resultado = authService.registrar(user);
        if (resultado.startsWith("Error")) {
            return ResponseEntity.badRequest().body(Map.of("error", resultado));
        }
        return ResponseEntity.ok(Map.of("mensaje", resultado));
    }

    // HU15: Logout
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok(Map.of("mensaje", "Sesión cerrada"));
    }

    // HU16: Cambiar rol
    @PutMapping("/usuarios/{id}/rol")
    public ResponseEntity<?> cambiarRol(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String nuevoRol = body.get("role");
        if (!nuevoRol.equals("ADMIN") && !nuevoRol.equals("USER")) {
            return ResponseEntity.badRequest().body(Map.of("error", "Rol inválido"));
        }
        return userRepository.findById(id)
                .map(user -> {
                    user.setRole(nuevoRol);
                    return ResponseEntity.ok(Map.of("mensaje", "Rol actualizado a " + nuevoRol));
                })
                .orElse(ResponseEntity.status(404).body(Map.of("error", "Usuario no encontrado")));
    }
}
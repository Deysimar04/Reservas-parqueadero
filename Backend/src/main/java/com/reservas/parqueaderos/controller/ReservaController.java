package com.reservas.parqueaderos.controller;

import com.reservas.parqueaderos.model.Reserva;
import com.reservas.parqueaderos.model.Users;
import com.reservas.parqueaderos.repository.UserRepository;
import com.reservas.parqueaderos.service.ReservaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservas")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ReservaController {

    private final ReservaService reservaService;
    private final UserRepository userRepository;

    // HU33: Historial del usuario autenticado
    @GetMapping("/mis-reservas")
    public ResponseEntity<?> getMisReservas(Authentication auth) {
        try {
            Long userId = getIdFromAuth(auth);
            List<Reserva> reservas = reservaService.getReservasByUser(userId);
            return ResponseEntity.ok(reservas);
        } catch (Exception e) {
            return ResponseEntity.status(404)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // Admin: todas las reservas
    @GetMapping("/todas")
    public ResponseEntity<?> getTodas() {
        try {
            List<Reserva> reservas = reservaService.getTodas();
            // Mapear a DTO con usuario incluido
            List<Map<String, Object>> resultado = reservas.stream().map(r -> {
                Map<String, Object> map = new java.util.LinkedHashMap<>();
                map.put("id", r.getId());
                map.put("startTime", r.getStartTime());
                map.put("endTime", r.getEndTime());
                map.put("estado", r.getEstado());
                map.put("product", r.getProduct());
                // Incluir usuario explícitamente
                if (r.getUser() != null) {
                    Map<String, Object> user = new java.util.LinkedHashMap<>();
                    user.put("id",       r.getUser().getId());
                    user.put("username", r.getUser().getUsername());
                    user.put("email",    r.getUser().getEmail());
                    map.put("user", user);
                } else {
                    map.put("user", null);
                }
                return map;
            }).collect(java.util.stream.Collectors.toList());
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // HU32: Crear reserva
    @PostMapping
    public ResponseEntity<?> crearReserva(
            @RequestBody Reserva reserva,
            Authentication auth
    ) {
        try {
            Long userId = getIdFromAuth(auth);
            Users user = new Users();
            user.setId(userId);
            reserva.setUser(user);
            Reserva nueva = reservaService.crearReserva(reserva);
            return ResponseEntity.ok(nueva);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // HU31: Detalle de reserva
    @GetMapping("/{id}")
    public ResponseEntity<?> getReserva(@PathVariable Long id) {
        try {
            Reserva reserva = reservaService.getReservaById(id);
            return ResponseEntity.ok(reserva);
        } catch (Exception e) {
            return ResponseEntity.status(404)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // Cancelar reserva
    @PutMapping("/{id}/cancelar")
    public ResponseEntity<?> cancelar(
            @PathVariable Long id,
            Authentication auth
    ) {
        try {
            Long userId = getIdFromAuth(auth);
            reservaService.cancelarReserva(id, userId);
            return ResponseEntity.ok(Map.of("mensaje", "Reserva cancelada exitosamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // Util: obtener ID del usuario autenticado
    private Long getIdFromAuth(Authentication auth) {
        if (auth == null || auth.getName() == null) {
            throw new RuntimeException("Usuario no autenticado");
        }
        return userRepository.findByUsername(auth.getName())
                .map(Users::getId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
}
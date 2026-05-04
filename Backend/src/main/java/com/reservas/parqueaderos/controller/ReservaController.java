package com.reservas.parqueaderos.controller;

import com.reservas.parqueaderos.model.Reserva;
import com.reservas.parqueaderos.model.Users;
import com.reservas.parqueaderos.repository.UserRepository;
import com.reservas.parqueaderos.service.ReservaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservas")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ReservaController {

    private final ReservaService reservaService;
    private final UserRepository userRepository;

    // ✅ Obtener reservas del usuario autenticado
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

    // ✅ Cancelar reserva (validando propietario)
    @PutMapping("/{id}/cancelar")
    public ResponseEntity<?> cancelar(@PathVariable Long id, Authentication auth) {
        try {
            Long userId = getIdFromAuth(auth);

            reservaService.cancelarReserva(id, userId);

            return ResponseEntity.ok(
                    Map.of("mensaje", "Reserva cancelada exitosamente")
            );

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // 🔐 Obtener ID del usuario autenticado
    private Long getIdFromAuth(Authentication auth) {
        return userRepository.findByUsername(auth.getName())
                .map(Users::getId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
}
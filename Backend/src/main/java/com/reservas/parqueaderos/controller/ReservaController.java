package com.reservas.parqueaderos.controller;

import com.reservas.parqueaderos.model.Reserva;
import com.reservas.parqueaderos.repository.UserRepository;
import com.reservas.parqueaderos.service.ReservaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservas")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ReservaController {

    private final ReservaService reservaService;
    private final UserRepository userRepository;

    @GetMapping("/mis-reservas")
    public ResponseEntity<?> getMisReservas(Authentication auth) {
        if (auth == null) {
            return ResponseEntity.status(401).body("No autenticado");
        }
        System.out.println(">>> Auth name: " + auth.getName());
        Long userId = userRepository.findByUsername(auth.getName())
                .map(u -> {
                    System.out.println(">>> Usuario encontrado: " + u.getId());
                    return u.getId();
                })
                .orElse(null);

        if (userId == null) {
            return ResponseEntity.status(404).body("Usuario no encontrado");
        }
        List<Reserva> reservas = reservaService.getReservasByUser(userId);
        return ResponseEntity.ok(reservas);
    }

    @PutMapping("/{id}/cancelar")
    public ResponseEntity<?> cancelar(@PathVariable Long id, Authentication auth) {
        if (auth == null) {
            return ResponseEntity.status(401).body("No autenticado");
        }
        System.out.println(">>> Auth name cancelar: " + auth.getName());
        Long userId = userRepository.findByUsername(auth.getName())
                .map(u -> u.getId())
                .orElse(null);

        if (userId == null) {
            return ResponseEntity.status(404).body("Usuario no encontrado");
        }
        reservaService.cancelarReserva(id, userId);
        return ResponseEntity.ok("Reserva cancelada exitosamente");
    }
}
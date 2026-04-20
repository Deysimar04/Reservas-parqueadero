package com.reservas.parqueaderos.controller;

import com.reservas.parqueaderos.model.Reserva;
import com.reservas.parqueaderos.model.User;
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
    public ResponseEntity<List<Reserva>> getMisReservas(Authentication auth) {
        Long userId = getIdFromAuth(auth);
        return ResponseEntity.ok(reservaService.getReservasByUser(userId));
    }

    //  HU9: Cancelación con validación de userId
    @PutMapping("/{id}/cancelar")
    public ResponseEntity<String> cancelar(@PathVariable Long id, Authentication auth) {
        Long userId = getIdFromAuth(auth);
        reservaService.cancelarReserva(id, userId);
        return ResponseEntity.ok("Reserva cancelada exitosamente");
    }

    private Long getIdFromAuth(Authentication auth) {
        return userRepository.findByUsername(auth.getName())
                .map(User::getId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
}
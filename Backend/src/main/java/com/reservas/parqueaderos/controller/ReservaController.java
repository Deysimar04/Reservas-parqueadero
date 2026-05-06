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

    // Obtener reservas del usuario autenticado
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

    // Solo para admin - todas las reservas
    @GetMapping("/todas")
    public ResponseEntity <? > getTodas() {
        try {
            List<Reserva> reservas = reservaService.getTodas();
            return ResponseEntity.ok(reservas);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // Cancelar reserva (validando propietario)
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

    // Obtener ID del usuario autenticado
    private Long getIdFromAuth(Authentication auth) {
        if (auth == null || auth.getName() == null) {
            throw new RuntimeException("Usuario no autenticado");
        }

        return userRepository.findByUsername(auth.getName())
                .map(Users::getId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    //  Validar disponibilidad (HU30 + HU23)
    @GetMapping("/disponibilidad")
    public ResponseEntity<?> validarDisponibilidad(
            @RequestParam Long productId,
            @RequestParam String startTime,
            @RequestParam String endTime
    ) {
        try {
            boolean disponible = reservaService.estaDisponible(
                    productId,
                    java.time.LocalDateTime.parse(startTime),
                    java.time.LocalDateTime.parse(endTime)
            );

            return ResponseEntity.ok(Map.of("disponible", disponible));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    //  Crear reserva (HU32)
    @PostMapping
    public ResponseEntity<?> crearReserva(@RequestBody Reserva reserva, Authentication auth) {
        try {
            Long userId = getIdFromAuth(auth);

            // Asignar usuario automáticamente
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

    // Detalle de Rerserva (HU31)
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
}
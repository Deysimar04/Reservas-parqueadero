package com.reservas.parqueaderos.service;

import com.reservas.parqueaderos.model.Reserva;
import com.reservas.parqueaderos.model.Users;
import com.reservas.parqueaderos.repository.ReservaRepository;
import com.reservas.parqueaderos.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservaService {

    private final ReservaRepository reservaRepository;
    private final UserRepository userRepository; // ← inyectado

    // HU33: Historial ordenado por fecha descendente
    public List<Reserva> getReservasByUser(Long userId) {
        return reservaRepository.findByUserIdOrderByStartTimeDesc(userId);
    }

    // HU31: Detalle de reserva por ID
    public Reserva getReservaById(Long id) {
        return reservaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada con ID: " + id));
    }

    // HU30 + HU23: Verificar disponibilidad
    public boolean estaDisponible(Long productId, LocalDateTime startTime, LocalDateTime endTime) {
        if (startTime == null || endTime == null) {
            throw new RuntimeException("Las fechas no pueden ser nulas");
        }
        if (!startTime.isBefore(endTime)) {
            throw new RuntimeException("La fecha de inicio debe ser anterior a la fecha de fin");
        }
        if (startTime.isBefore(LocalDateTime.now())) {
            throw new RuntimeException("No puedes reservar en una fecha pasada");
        }

        List<Reserva> conflictos = reservaRepository
                .findByProductIdAndStartTimeLessThanAndEndTimeGreaterThan(
                        productId, endTime, startTime
                );

        return conflictos.stream()
                .noneMatch(r -> !"CANCELLED".equalsIgnoreCase(r.getEstado()));
    }

    // HU23: IDs de productos ocupados en un rango
    public List<Long> getProductosOcupados(LocalDateTime start, LocalDateTime end) {
        return reservaRepository.findConflictosEnRango(start, end)
                .stream()
                .map(r -> r.getProduct().getId())
                .distinct()
                .collect(Collectors.toList());
    }

    // HU32: Crear reserva con validaciones completas
    public Reserva crearReserva(Reserva reserva) {
        if (reserva.getProduct() == null || reserva.getProduct().getId() == null) {
            throw new RuntimeException("Debes indicar un producto/plaza válido");
        }
        if (reserva.getStartTime() == null || reserva.getEndTime() == null) {
            throw new RuntimeException("Debes indicar fecha y hora de inicio y fin");
        }
        if (!reserva.getStartTime().isBefore(reserva.getEndTime())) {
            throw new RuntimeException("La fecha de inicio debe ser anterior a la de fin");
        }
        if (reserva.getStartTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("No puedes reservar en una fecha pasada");
        }

        boolean disponible = estaDisponible(
                reserva.getProduct().getId(),
                reserva.getStartTime(),
                reserva.getEndTime()
        );

        if (!disponible) {
            throw new RuntimeException("La plaza no está disponible en ese rango de fechas");
        }

        reserva.setEstado("CONFIRMED");
        return reservaRepository.save(reserva);
    }

    // Cancelar reserva — admin puede cancelar cualquiera, cliente solo la suya
    public void cancelarReserva(Long reservaId, Long userId) {
        Reserva reserva = reservaRepository.findById(reservaId)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));

        Users usuarioActual = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        boolean esAdmin = "ADMIN".equalsIgnoreCase(usuarioActual.getRole());
        boolean esDueno = reserva.getUser().getId().equals(userId);

        if (!esAdmin && !esDueno) {
            throw new RuntimeException("No tienes permiso para cancelar esta reserva");
        }
        if ("CANCELLED".equalsIgnoreCase(reserva.getEstado())) {
            throw new RuntimeException("La reserva ya estaba cancelada");
        }

        reserva.setEstado("CANCELLED");
        reservaRepository.save(reserva);
    }

    // Admin: todas las reservas
    public List<Reserva> getTodas() {
        return reservaRepository.findAll();
    }
}
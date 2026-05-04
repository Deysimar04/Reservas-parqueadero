package com.reservas.parqueaderos.service;

import com.reservas.parqueaderos.model.Reserva;
import com.reservas.parqueaderos.repository.ReservaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservaService {

    private final ReservaRepository reservaRepository;

    // ✅ Obtener reservas por usuario
    public List<Reserva> getReservasByUser(Long userId) {
        return reservaRepository.findByUserId(userId);
    }

    // ✅ Crear reserva con validación REAL
    public Reserva crearReserva(Reserva nuevaReserva) {

        // Validaciones básicas
        if (nuevaReserva.getStartTime() == null || nuevaReserva.getEndTime() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Debe especificar fecha de inicio y fin"
            );
        }

        if (nuevaReserva.getEndTime().isBefore(nuevaReserva.getStartTime())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La fecha fin no puede ser menor que la fecha inicio"
            );
        }

        // 🔥 VALIDACIÓN CLAVE: evitar doble reserva
        List<Reserva> conflictos = reservaRepository
                .findByProductIdAndStartTimeLessThanAndEndTimeGreaterThan(
                        nuevaReserva.getProduct().getId(),
                        nuevaReserva.getEndTime(),
                        nuevaReserva.getStartTime()
                );

        if (!conflictos.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "El parqueadero ya está reservado en ese horario"
            );
        }

        // Estado inicial
        nuevaReserva.setEstado("CONFIRMADA");

        return reservaRepository.save(nuevaReserva);
    }

    // ✅ Cancelar reserva con validación de usuario
    public void cancelarReserva(Long reservaId, Long userId) {

        Reserva reserva = reservaRepository.findByIdAndUserId(reservaId, userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "No tienes permiso para cancelar esta reserva"
                ));

        if ("CANCELADA".equals(reserva.getEstado())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La reserva ya está cancelada"
            );
        }

        reserva.setEstado("CANCELADA");

        // 🔥 CORRECTO en JPA
        reservaRepository.save(reserva);
    }
}
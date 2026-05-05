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
     // Evita reservas de 0 minutos
        if (nuevaReserva.getStartTime().isEqual(nuevaReserva.getEndTime())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La reserva debe tener una duración válida"
            );
        }

        if (nuevaReserva.getEndTime().isBefore(nuevaReserva.getStartTime())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La fecha fin no puede ser menor que la fecha inicio"
            );
        }

        // 🔥 VALIDACIÓN CLAVE: evitar doble reserva
        boolean disponible = estaDisponible(
                nuevaReserva.getProduct().getId(),
                nuevaReserva.getStartTime(),
                nuevaReserva.getEndTime()
        );

        if (!disponible) {
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
    public boolean estaDisponible(Long productId, LocalDateTime startTime, LocalDateTime endTime) {

        List<Reserva> conflictos = reservaRepository
                .findByProductIdAndStartTimeLessThanAndEndTimeGreaterThan(
                        productId,
                        endTime,
                        startTime
                );

        return conflictos.isEmpty();
    }

    public Reserva getReservaById(Long reservaId) {
        return reservaRepository.findById(reservaId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Reserva no encontrada"
                ));
    }
}
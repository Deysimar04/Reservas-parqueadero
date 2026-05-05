package com.reservas.parqueaderos.repository;

import com.reservas.parqueaderos.model.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    // HU: Obtener reservas por usuario
    List<Reserva> findByUserId(Long userId);

    // HU9: Buscar reserva solo si pertenece al usuario
    Optional<Reserva> findByIdAndUserId(Long id, Long userId);

    // CLAVE: detectar conflictos de horario (evitar doble reserva)
    List<Reserva> findByProductIdAndStartTimeLessThanAndEndTimeGreaterThan(
            Long productId,
            LocalDateTime endTime,
            LocalDateTime startTime
    );
}
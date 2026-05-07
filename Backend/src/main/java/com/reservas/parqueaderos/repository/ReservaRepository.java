package com.reservas.parqueaderos.repository;

import com.reservas.parqueaderos.model.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    // HU33: Historial de reservas ordenado por fecha descendente
    List<Reserva> findByUserIdOrderByStartTimeDesc(Long userId);

    // HU9: Buscar reserva solo si pertenece al usuario
    Optional<Reserva> findByIdAndUserId(Long id, Long userId);

    // HU30 + HU23: Detectar conflictos de horario (evitar doble reserva)
    List<Reserva> findByProductIdAndStartTimeLessThanAndEndTimeGreaterThan(
            Long productId,
            LocalDateTime endTime,
            LocalDateTime startTime
    );

    // HU23: Obtener todas las reservas activas en un rango de fechas
    @Query("SELECT r FROM Reserva r WHERE r.startTime < :endTime " +
            "AND r.endTime > :startTime AND r.estado != 'CANCELLED'")
    List<Reserva> findConflictosEnRango(
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime")   LocalDateTime endTime
    );
}
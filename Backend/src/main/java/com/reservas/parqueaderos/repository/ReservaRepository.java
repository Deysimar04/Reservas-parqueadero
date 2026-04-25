package com.reservas.parqueaderos.repository;

import com.reservas.parqueaderos.model.Reserva;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public class ReservaRepository {

    private final List<Reserva> reservas = new ArrayList<>();
    private Long nextId = 2L;

    // Reserva de prueba pre-cargada
    public ReservaRepository() {
        Reserva r = new Reserva();
        r.setId(1L);
        r.setUserId(2L);
        r.setProductId(1L);
        r.setEstado("ACTIVA");
        reservas.add(r);
    }

    public List<Reserva> findByUserId(Long userId) {
        return reservas.stream()
                .filter(r -> r.getUserId().equals(userId))
                .collect(Collectors.toList());
    }

    public Optional<Reserva> findById(Long id) {
        return reservas.stream()
                .filter(r -> r.getId().equals(id))
                .findFirst();
    }

    public Optional<Reserva> findByIdAndUserId(Long id, Long userId) {
        return reservas.stream()
                .filter(r -> r.getId().equals(id) && r.getUserId().equals(userId))
                .findFirst();
    }

    public void save(Reserva reserva) {
        if (reserva.getId() == null) {
            reserva.setId(nextId++);
            reservas.add(reserva);
        }
    }

    public void update(Reserva reserva) {
        // En memoria el objeto ya está modificado en la lista
    }
}
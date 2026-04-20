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
    private Long nextId = 1L;

    public List<Reserva> findByUserId(Long userId) {
        return reservas.stream()
                .filter(r -> r.getUserId().equals(userId))
                .collect(Collectors.toList());
    }

    //  HU9: Busca reserva solo si pertenece al usuario
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
        // como es en memoria, el objeto ya está modificado en la lista
    }
}
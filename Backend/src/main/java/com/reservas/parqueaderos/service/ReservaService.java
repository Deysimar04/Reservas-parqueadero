package com.reservas.parqueaderos.service;

import com.reservas.parqueaderos.model.Reserva;
import com.reservas.parqueaderos.repository.ReservaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservaService {

    private final ReservaRepository reservaRepository;

    public List<Reserva> getReservasByUser(Long userId) {
        return reservaRepository.findByUserId(userId);
    }

    // HU9: Valida que el userId coincida antes de cancelar
    public void cancelarReserva(Long reservaId, Long userId) {
        Reserva reserva = reservaRepository.findByIdAndUserId(reservaId, userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "No tienes permiso para cancelar esta reserva"
                ));

        if ("CANCELADA".equals(reserva.getEstado())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "La reserva ya está cancelada"
            );
        }

        reserva.setEstado("CANCELADA");
        reservaRepository.update(reserva);
    }
}
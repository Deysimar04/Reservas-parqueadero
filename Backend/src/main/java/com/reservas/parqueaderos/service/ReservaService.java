package com.reservas.parqueaderos.service;

import com.reservas.parqueaderos.model.Reserva;
import com.reservas.parqueaderos.repository.ReservaRepository;
import com.reservas.parqueaderos.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservaService {

    private final ReservaRepository reservaRepository;
    private final UserRepository userRepository;

    public List<Reserva> getReservasByUser(Long userId) {
        return reservaRepository.findByUserId(userId);
    }

    public void cancelarReserva(Long reservaId, Long userId, String role) {

        Reserva reserva;

        if ("ADMIN".equals(role)) {
            // ADMIN puede cancelar cualquier reserva
            reserva = reservaRepository.findById(reservaId)
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "No existe una reserva con ese ID"
                    ));
        } else {
            // Usuario normal solo puede cancelar sus propias reservas
            reserva = reservaRepository.findByIdAndUserId(reservaId, userId)
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.FORBIDDEN,
                            "No tienes permiso para cancelar esta reserva"
                    ));
        }

        if ("CANCELADA".equals(reserva.getEstado())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La reserva ya está cancelada"
            );
        }

        reserva.setEstado("CANCELADA");
        reservaRepository.update(reserva);
    }
}
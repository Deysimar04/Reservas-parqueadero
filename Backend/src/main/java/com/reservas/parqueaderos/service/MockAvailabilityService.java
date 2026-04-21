package com.reservas.parqueaderos.service;

import com.reservas.parqueaderos.model.Availability;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.Arrays;

@Service
public class MockAvailabilityService implements AvailabilityStrategy {

    @Override
    public Availability checkAvailability(Long productId) {
        // Datos falsos (Mock) para que el frontend pueda graficar el calendario
        return new Availability(
                Arrays.asList(LocalDate.now().plusDays(1), LocalDate.now().plusDays(2)), // Ocupados mañana y pasado
                Arrays.asList(LocalDate.now(), LocalDate.now().plusDays(3), LocalDate.now().plusDays(4)) // Libres hoy y el resto
        );
    }
}

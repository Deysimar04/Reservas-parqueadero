package com.reservas.parqueaderos.service;

import com.reservas.parqueaderos.model.Availability;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MockAvailabilityService implements AvailabilityStrategy {

    @Override
    public Availability checkAvailability(Long productId) {
        return new Availability(List.of(), List.of());
    }

    public int getPlazasDisponibles(Long productId) {
        return switch (productId.intValue() % 3) {
            case 0 -> 5;
            case 1 -> 3;
            default -> 7;
        };
    }

    public int getPlazasOcupadas(Long productId) {
        return switch (productId.intValue() % 3) {
            case 0 -> 3;
            case 1 -> 5;
            default -> 1;
        };
    }

    public int getTotalPlazas(Long productId) {
        return getPlazasDisponibles(productId) + getPlazasOcupadas(productId);
    }
}
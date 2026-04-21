package com.reservas.parqueaderos.service;

import com.reservas.parqueaderos.model.Availability;

public interface AvailabilityStrategy {
    Availability checkAvailability(Long productId);
}

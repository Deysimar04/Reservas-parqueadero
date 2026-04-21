package com.reservas.parqueaderos.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
public class Availability {
    private List<LocalDate> occupiedDates;
    private List<LocalDate> availableDates;
}

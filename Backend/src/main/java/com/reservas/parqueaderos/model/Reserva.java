package com.reservas.parqueaderos.model;

import lombok.Data;

@Data
public class Reserva {
    private Long id;
    private Long userId;
    private Long productId;
    private String fechaInicio;
    private String fechaFin;
    private String estado; // "ACTIVA", "CANCELADA", "COMPLETADA"
}
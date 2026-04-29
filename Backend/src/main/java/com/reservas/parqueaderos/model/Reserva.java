package com.reservas.parqueaderos.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Reserva {

    private Long id;

    @JsonIgnore // No exponer userId en respuestas
    private Long userId;

    private Long productId;
    private String fechaInicio;
    private String fechaFin;
    private String estado;
}
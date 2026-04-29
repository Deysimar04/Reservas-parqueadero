package com.reservas.parqueaderos.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @JsonIgnore // No mostrar id en respuestas
    private Long id;

    private String username;

    @JsonIgnore // Nunca mostrar password
    private String password;

    private String email;
    private String role;
}
package com.reservas.parqueaderos.model;



import lombok.AllArgsConstructor;

import lombok.Data;

import lombok.NoArgsConstructor;



@Data

@AllArgsConstructor

@NoArgsConstructor

public class Feature {

    private Long id;

    private String name;

    private String icon; // Ejemplo: "shield", "roof"

}
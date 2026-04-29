package com.reservas.parqueaderos.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL) // No mostrar campos nulos
public class Product {

    private Long id;
    private String name;
    private String description;
    private String category;
    private List<String> images;
    private List<Feature> features;
}
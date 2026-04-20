package com.reservas.parqueaderos.model;

import lombok.Data;
import java.util.List;

@Data
public class Product {
    private Long id;
    private String name;
    private String description;
    private String category;
    private List<String> images;
    private List<String> features;
}
package com.reservas.parqueaderos.repository;

import org.springframework.stereotype.Repository;
import java.util.ArrayList;
import java.util.List;

@Repository
public class CategoryRepository {

    // HU12: Categorías pre-sembradas en memoria
    private final List<String> categories = new ArrayList<>(List.of(
            "Cubierto",
            "Descubierto",
            "Motos",
            "Bicicletas",
            "Discapacitados"
    ));

    public List<String> findAll() {
        return categories;
    }

    // HU21 opcional: Agregar nueva categoría
    public void save(String category) {
        categories.add(category);
    }
}
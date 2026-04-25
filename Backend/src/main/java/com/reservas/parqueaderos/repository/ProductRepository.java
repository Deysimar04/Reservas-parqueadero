package com.reservas.parqueaderos.repository;

import com.reservas.parqueaderos.model.Product;
import org.springframework.stereotype.Repository;
import java.util.ArrayList;
import java.util.List;

@Repository
public class ProductRepository {

    private List<Product> products = new ArrayList<>();
    private Long nextId = 1L;

    public List<Product> findAll() {
        return products;
    }

    // HU3: Verificar duplicados por nombre
    public boolean existsByName(String name) {
        return products.stream()
                .anyMatch(p -> p.getName().equalsIgnoreCase(name));
    }

    public void save(Product product) {
        product.setId(nextId++);
        products.add(product);
    }
}
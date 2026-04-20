package com.reservas.Parqueaderos.repository;

import com.reservas.Parqueaderos.model.Product;
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

    public void save(Product product) {
        product.setId(nextId++);
        products.add(product);
    }
}
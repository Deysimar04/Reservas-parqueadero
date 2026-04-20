package com.reservas.parqueaderos.service;

import com.reservas.parqueaderos.model.Product;
import com.reservas.parqueaderos.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProductService {
    @Autowired
    private ProductRepository repository;

    public List<Product> obtenerTodos() {
        return repository.findAll();
    }

    public void registrar(Product product) {
        repository.save(product);
    }
}
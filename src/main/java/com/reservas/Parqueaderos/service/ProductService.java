package com.reservas.Parqueaderos.service;

import com.reservas.Parqueaderos.model.Product;
import com.reservas.Parqueaderos.repository.ProductRepository;
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
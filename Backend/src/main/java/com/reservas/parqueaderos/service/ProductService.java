package com.reservas.parqueaderos.service;

import com.reservas.parqueaderos.model.Feature;
import com.reservas.parqueaderos.model.Product;
import com.reservas.parqueaderos.repository.ProductFeatureRepository;
import com.reservas.parqueaderos.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository repository;

    @Autowired
    private ProductFeatureRepository featureRepository;

    public List<Product> obtenerTodos() {
        return repository.findAll();
    }

    // HU3: Registrar con validación de duplicados
    public String registrar(Product product) {
        if (product.getName() == null || product.getName().isBlank()) {
            return "Error: El nombre es obligatorio";
        }
        if (repository.existsByName(product.getName())) {
            return "Error: Ya existe un producto con ese nombre";
        }
        repository.save(product);
        return "ok";
    }

    // HU17: Listar características
    public List<Feature> listarTodasLasCaracteristicas() {
        return featureRepository.findAll();
    }
}
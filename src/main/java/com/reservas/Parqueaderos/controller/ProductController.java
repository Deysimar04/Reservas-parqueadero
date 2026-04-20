package com.reservas.Parqueaderos.controller;

import com.reservas.Parqueaderos.model.Product;
import com.reservas.Parqueaderos.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/productos")
@CrossOrigin(origins = "*") // Permite que tu frontend se conecte sin errores de CORS
public class ProductController {

    @Autowired
    private ProductService productService;

    // HU10: Listar productos
    @GetMapping
    public List<Product> listar() {
        return productService.obtenerTodos();
    }

    // HU3: Registrar producto
    @PostMapping
    public String guardar(@RequestBody Product product) {
        productService.registrar(product);
        return "Producto registrado con éxito en memoria";
    }
}
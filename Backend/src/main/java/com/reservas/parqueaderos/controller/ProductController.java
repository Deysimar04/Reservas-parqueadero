package com.reservas.parqueaderos.controller;

import com.reservas.parqueaderos.model.Availability;
import com.reservas.parqueaderos.model.Feature;
import com.reservas.parqueaderos.model.Product;
import com.reservas.parqueaderos.repository.CategoryRepository;
import com.reservas.parqueaderos.service.MockAvailabilityService;
import com.reservas.parqueaderos.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/productos")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private MockAvailabilityService availabilityService;

    @Autowired
    private CategoryRepository categoryRepository; // ← NUEVO

    // HU10: Listar productos
    @GetMapping
    public List<Product> listar() {
        return productService.obtenerTodos();
    }

    // HU3: Registrar producto con validaciones
    @PostMapping
    public ResponseEntity<?> guardar(@RequestBody Product product) {
        String resultado = productService.registrar(product);
        if (resultado.startsWith("Error")) {
            return ResponseEntity.badRequest().body(Map.of("error", resultado));
        }
        return ResponseEntity.ok(Map.of("mensaje", "Producto registrado con éxito"));
    }

    // HU12: Listar categorías pre-sembradas
    @GetMapping("/categorias")
    public List<String> listarCategorias() {
        return categoryRepository.findAll();
    }

    // HU17: Listar características
    @GetMapping("/caracteristicas")
    public List<Feature> listarCaracteristicas() {
        return productService.listarTodasLasCaracteristicas();
    }

    // HU23: Disponibilidad mock
    @GetMapping("/{id}/disponibilidad")
    public Availability obtenerDisponibilidad(@PathVariable Long id) {
        return availabilityService.checkAvailability(id);
    }
}
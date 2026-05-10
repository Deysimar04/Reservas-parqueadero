package com.reservas.parqueaderos.controller;

import com.reservas.parqueaderos.model.Availability;
import com.reservas.parqueaderos.model.Category;
import com.reservas.parqueaderos.model.Feature;
import com.reservas.parqueaderos.model.Product;
import com.reservas.parqueaderos.repository.CategoryRepository;
import com.reservas.parqueaderos.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final CategoryRepository categoryRepository;

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
            return ResponseEntity.badRequest()
                    .body(Map.of("error", resultado));
        }

        return ResponseEntity.ok(
                Map.of("mensaje", "Producto registrado con éxito")
        );
    }

    //  CORREGIDO: categorías desde BD
    @GetMapping("/categorias")
    public List<Category> listarCategorias() {
        return categoryRepository.findAll();
    }

    //  HU17: características (desde BD)
    @GetMapping("/caracteristicas")
    public List<Feature> listarCaracteristicas() {
        return productService.listarTodasLasCaracteristicas();
    }

    // DISPONIBILIDAD REAL (recomendado)
    @GetMapping("/{id}/disponibilidad")
    public ResponseEntity<?> obtenerDisponibilidad(@PathVariable Long id) {

        Availability disponibilidad = productService.obtenerDisponibilidad(id);

        if (disponibilidad == null) {
            return ResponseEntity.status(404)
                    .body(Map.of("error", "Producto no encontrado"));
        }

        return ResponseEntity.ok(disponibilidad);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {

    productService.eliminar(id);

    return ResponseEntity.ok(
            Map.of("mensaje", "Producto eliminado")
    );
}
}
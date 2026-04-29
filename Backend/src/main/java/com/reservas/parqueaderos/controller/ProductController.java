package com.reservas.parqueaderos.controller;

import com.reservas.parqueaderos.model.Feature;
import com.reservas.parqueaderos.model.Product;
import com.reservas.parqueaderos.repository.CategoryRepository;
import com.reservas.parqueaderos.repository.UserRepository;
import com.reservas.parqueaderos.service.MockAvailabilityService;
import com.reservas.parqueaderos.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/productos")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private MockAvailabilityService availabilityService;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    // HU10: Listar productos
    @GetMapping
    public List<Product> listar() {
        return productService.obtenerTodos();
    }

    // HU3: Registrar producto
    @PostMapping
    public ResponseEntity<?> guardar(@RequestBody Product product) {
        String resultado = productService.registrar(product);
        if (resultado.startsWith("Error")) {
            return ResponseEntity.badRequest().body(Map.of("error", resultado));
        }
        return ResponseEntity.ok(Map.of("mensaje", "Producto registrado con éxito"));
    }

    // HU12: Listar categorías
    @GetMapping("/categorias")
    public List<String> listarCategorias() {
        return categoryRepository.findAll();
    }

    // HU17: Listar características
    @GetMapping("/caracteristicas")
    public List<Feature> listarCaracteristicas() {
        return productService.listarTodasLasCaracteristicas();
    }

    // HU17: Agregar característica
    @PostMapping("/caracteristicas")
    public ResponseEntity<?> agregarCaracteristica(@RequestBody Feature feature) {
        String resultado = productService.agregarCaracteristica(feature);
        if (resultado.startsWith("Error")) {
            return ResponseEntity.badRequest().body(Map.of("error", resultado));
        }
        return ResponseEntity.ok(Map.of("mensaje", "Característica agregada con éxito"));
    }

    // HU17: Editar característica
    @PutMapping("/caracteristicas/{id}")
    public ResponseEntity<?> editarCaracteristica(
            @PathVariable Long id,
            @RequestBody Feature feature) {
        String resultado = productService.editarCaracteristica(id, feature);
        if (resultado.startsWith("Error")) {
            return ResponseEntity.badRequest().body(Map.of("error", resultado));
        }
        return ResponseEntity.ok(Map.of("mensaje", "Característica actualizada con éxito"));
    }

    // HU17: Eliminar característica
    @DeleteMapping("/caracteristicas/{id}")
    public ResponseEntity<?> eliminarCaracteristica(@PathVariable Long id) {
        String resultado = productService.eliminarCaracteristica(id);
        if (resultado.startsWith("Error")) {
            return ResponseEntity.badRequest().body(Map.of("error", resultado));
        }
        return ResponseEntity.ok(Map.of("mensaje", "Característica eliminada con éxito"));
    }

    // HU23: Disponibilidad por plazas
    @GetMapping("/{id}/disponibilidad")
    public ResponseEntity<?> obtenerDisponibilidad(@PathVariable Long id) {
        return ResponseEntity.ok(Map.of(
                "productId", id,
                "plazasDisponibles", availabilityService.getPlazasDisponibles(id),
                "plazasOcupadas", availabilityService.getPlazasOcupadas(id),
                "totalPlazas", availabilityService.getTotalPlazas(id)
        ));
    }

    // Ver usuarios registrados como administrador
    @GetMapping("/admin/usuarios")
    public ResponseEntity<?> listarUsuarios() {
        List<Map<String, Object>> usuarios = userRepository.findAll()
                .stream()
                .map(u -> Map.<String, Object>of(
                        "id", u.getId(),
                        "username", u.getUsername(),
                        "email", u.getEmail(),
                        "role", u.getRole()
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(usuarios);
    }
}
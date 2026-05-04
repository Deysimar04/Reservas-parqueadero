package com.reservas.parqueaderos.service;

import com.reservas.parqueaderos.model.Availability;
import com.reservas.parqueaderos.model.Feature;
import com.reservas.parqueaderos.model.Product;
import com.reservas.parqueaderos.model.Reserva;
import com.reservas.parqueaderos.repository.ProductFeatureRepository;
import com.reservas.parqueaderos.repository.ProductRepository;
import com.reservas.parqueaderos.repository.ReservaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductFeatureRepository featureRepository;
    private final ReservaRepository reservaRepository;

    // ✅ Listar productos
    public List<Product> obtenerTodos() {
        return productRepository.findAll();
    }

    // ✅ Registrar producto
    public String registrar(Product product) {

        if (product.getName() == null || product.getName().isBlank()) {
            return "Error: El nombre es obligatorio";
        }

        if (productRepository.existsByNameIgnoreCase(product.getName())) {
            return "Error: Ya existe un producto con ese nombre";
        }

        if (product.getFeatures() != null) {
            product.getFeatures().forEach(f -> f.setProduct(product));
        }

        productRepository.save(product);

        return "ok";
    }

    // ✅ Listar características
    public List<Feature> listarTodasLasCaracteristicas() {
        return featureRepository.findAll();
    }

    // 🔥 DISPONIBILIDAD REAL
    public Availability obtenerDisponibilidad(Long productId) {

        List<Reserva> reservas = reservaRepository.findAll()
                .stream()
                .filter(r -> r.getProduct().getId().equals(productId))
                .toList();

        // días ocupados
        List<LocalDate> ocupados = reservas.stream()
                .map(r -> r.getStartTime().toLocalDate())
                .distinct()
                .collect(Collectors.toList());

        // ejemplo simple de días libres (puedes mejorar esto)
        List<LocalDate> libres = List.of(
                        LocalDate.now(),
                        LocalDate.now().plusDays(1),
                        LocalDate.now().plusDays(2),
                        LocalDate.now().plusDays(3)
                ).stream()
                .filter(d -> !ocupados.contains(d))
                .toList();

        return new Availability();
    }
}
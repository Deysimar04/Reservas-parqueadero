package com.reservas.parqueaderos.repository;

import com.reservas.parqueaderos.model.Feature;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductFeatureRepository extends JpaRepository<Feature, Long> {

    // Obtener features por producto
    List<Feature> findByProductId(Long productId);

}
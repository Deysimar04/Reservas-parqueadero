package com.reservas.parqueaderos.repository;

import com.reservas.parqueaderos.model.Feature;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class ProductFeatureRepository {

    private List<Feature> features = new ArrayList<>();
    private Long nextId = 1L;

    public ProductFeatureRepository() {
        features.add(new Feature(nextId++, "Seguridad 24h", "shield"));
        features.add(new Feature(nextId++, "Techado", "roof"));
    }

    public List<Feature> findAll() {
        return features;
    }

    public Optional<Feature> findById(Long id) {
        return features.stream()
                .filter(f -> f.getId().equals(id))
                .findFirst();
    }

    public void save(Feature feature) {
        feature.setId(nextId++);
        features.add(feature);
    }

    public boolean update(Long id, Feature updated) {
        return findById(id).map(f -> {
            f.setName(updated.getName());
            f.setIcon(updated.getIcon());
            return true;
        }).orElse(false);
    }

    public boolean delete(Long id) {
        return features.removeIf(f -> f.getId().equals(id));
    }
}
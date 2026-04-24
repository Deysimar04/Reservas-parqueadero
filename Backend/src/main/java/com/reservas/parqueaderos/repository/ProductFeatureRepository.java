package com.reservas.Parqueaderos.repository;



import com.reservas.Parqueaderos.model.Feature;

import org.springframework.stereotype.Repository;

import java.util.ArrayList;

import java.util.List;



@Repository

public class ProductFeatureRepository {

    private List<Feature> features = new ArrayList<>();

    private Long nextId = 1L;



    public ProductFeatureRepository() {

        // Datos iniciales para que la lista no esté vacía

        features.add(new Feature(nextId++, "Seguridad 24h", "shield"));

        features.add(new Feature(nextId++, "Techado", "roof"));

    }



    public List<Feature> findAll() {

        return features;

    }



    public void save(Feature feature) {

        feature.setId(nextId++);

        features.add(feature);

    }

}
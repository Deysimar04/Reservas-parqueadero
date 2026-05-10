package com.reservas.parqueaderos.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.reservas.parqueaderos.model.Category;

import java.util.Optional;
import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    // Buscar categoría por nombre (útil para validar duplicados)
    Optional<Category> findByName(String name);

    // Verificar si ya existe una categoría
    boolean existsByName(String name);

    // Búsqueda por coincidencia parcial (opcional, útil en frontend)
    List<Category> findByNameContainingIgnoreCase(String name);
}
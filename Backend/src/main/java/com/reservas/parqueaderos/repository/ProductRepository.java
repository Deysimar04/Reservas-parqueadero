package com.reservas.parqueaderos.repository;

import com.reservas.parqueaderos.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    boolean existsByNameIgnoreCase(String name);

    List<Product> findByCategory_Id(Long categoryId);
}
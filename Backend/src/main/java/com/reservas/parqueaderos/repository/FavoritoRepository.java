package com.reservas.parqueaderos.repository;

import com.reservas.parqueaderos.model.Favorito;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface FavoritoRepository extends MongoRepository<Favorito, String> {

    List<Favorito> findByUserId(Long userId);

    Optional<Favorito> findByUserIdAndProductoId(Long userId, Long productoId);

    boolean existsByUserIdAndProductoId(Long userId, Long productoId);

    void deleteByUserIdAndProductoId(Long userId, Long productoId);
}

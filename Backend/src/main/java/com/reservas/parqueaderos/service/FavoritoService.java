package com.reservas.parqueaderos.service;

import com.reservas.parqueaderos.model.Favorito;
import com.reservas.parqueaderos.model.Users;
import com.reservas.parqueaderos.repository.FavoritoRepository;
import com.reservas.parqueaderos.repository.ProductRepository;
import com.reservas.parqueaderos.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FavoritoService {

    private final FavoritoRepository favoritoRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public Favorito marcarFavorito(Long productoId, Authentication auth) {
        Long userId = getUserId(auth);

        if (!productRepository.existsById(productoId)) {
            throw new RuntimeException("Producto no encontrado");
        }

        return favoritoRepository.findByUserIdAndProductoId(userId, productoId)
                .orElseGet(() -> {
                    Favorito favorito = new Favorito();
                    favorito.setUserId(userId);
                    favorito.setProductoId(productoId);
                    favorito.setFechaCreacion(LocalDateTime.now());
                    return favoritoRepository.save(favorito);
                });
    }

    public void desmarcarFavorito(Long productoId, Authentication auth) {
        Long userId = getUserId(auth);
        favoritoRepository.deleteByUserIdAndProductoId(userId, productoId);
    }

    public List<Favorito> listarMisFavoritos(Authentication auth) {
        Long userId = getUserId(auth);
        return favoritoRepository.findByUserId(userId);
    }

    private Long getUserId(Authentication auth) {
        if (auth == null || auth.getName() == null) {
            throw new RuntimeException("Usuario no autenticado");
        }

        return userRepository.findByUsername(auth.getName())
                .map(Users::getId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
}

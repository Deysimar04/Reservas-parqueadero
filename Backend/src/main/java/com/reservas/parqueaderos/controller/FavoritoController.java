package com.reservas.parqueaderos.controller;

import com.reservas.parqueaderos.service.FavoritoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/favoritos")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class FavoritoController {

    private final FavoritoService favoritoService;

    @PostMapping("/{productoId}")
    public ResponseEntity<?> marcar(
            @PathVariable Long productoId,
            Authentication auth
    ) {
        try {
            return ResponseEntity.ok(favoritoService.marcarFavorito(productoId, auth));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{productoId}")
    public ResponseEntity<?> desmarcar(
            @PathVariable Long productoId,
            Authentication auth
    ) {
        try {
            favoritoService.desmarcarFavorito(productoId, auth);
            return ResponseEntity.ok(Map.of("mensaje", "Favorito eliminado"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> listar(Authentication auth) {
        try {
            return ResponseEntity.ok(favoritoService.listarMisFavoritos(auth));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}

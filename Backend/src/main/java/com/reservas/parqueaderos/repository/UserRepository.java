package com.reservas.parqueaderos.repository;

import com.reservas.parqueaderos.model.User;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class UserRepository {

    // Usuarios precargados en memoria
    private final List<User> users = new ArrayList<>(List.of(
            new User(1L, "admin",  "$2a$10$7QJ9v1HMtSBEjNYbX1z1/.placeholder", "admin@parqueadero.com",  "ADMIN"),
            new User(2L, "usuario","$2a$10$7QJ9v1HMtSBEjNYbX1z1/.placeholder", "usuario@parqueadero.com", "USER")
    ));

    public Optional<User> findByUsername(String username) {
        return users.stream()
                .filter(u -> u.getUsername().equals(username))
                .findFirst();
    }

    public Optional<User> findById(Long id) {
        return users.stream()
                .filter(u -> u.getId().equals(id))
                .findFirst();
    }

    public void save(User user) {
        user.setId((long) (users.size() + 1));
        users.add(user);
    }
}
package com.reservas.parqueaderos.repository;

import com.reservas.parqueaderos.model.User;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class UserRepository {

    private final List<User> users = new ArrayList<>(List.of(
            new User(1L, "admin",
                    "$2a$10$O5JxO29dGyv/E9A4kDUFlebejMboGjwZm7NVT4zPBbreN99j8OzqK",
                    "admin@parqueadero.com", "ADMIN"),
            new User(2L, "usuario",
                    "$2a$10$Fvyt6YTfCWO3FyU1Sto.ieBVCroxcCb1AjuPOc4POKcEm6es6bzIi",
                    "usuario@parqueadero.com", "USER")
    ));

    public Optional<User> findByUsername(String username) {
        return users.stream()
                .filter(u -> u.getUsername().equals(username))
                .findFirst();
    }

    public Optional<User> findByEmail(String email) {
        return users.stream()
                .filter(u -> u.getEmail().equalsIgnoreCase(email))
                .findFirst();
    }

    public Optional<User> findById(Long id) {
        return users.stream()
                .filter(u -> u.getId().equals(id))
                .findFirst();
    }

    public List<User> findAll() {
        return new ArrayList<>(users);
    }

    public void save(User user) {
        user.setId((long) (users.size() + 1));
        users.add(user);
    }
}
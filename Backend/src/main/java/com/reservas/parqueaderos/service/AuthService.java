
package com.reservas.Parqueaderos.service;

import com.reservas.Parqueaderos.model.User;
import com.reservas.Parqueaderos.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    public String registrar(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return "Error: El email ya está registrado";
        }
        userRepository.save(user);

        // HU19: Simulación de notificación por consola
        System.out.println("LOG: Enviando correo de bienvenida a " + user.getEmail());
        return "Usuario registrado con éxito";
    }

    public User login(String email, String password) {
        return userRepository.findByEmail(email)
                .filter(u -> u.getPassword().equals(password))
                .orElse(null);
    }
}

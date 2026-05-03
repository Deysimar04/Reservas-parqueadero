package com.reservas.parqueaderos.service;

import com.reservas.parqueaderos.model.User;
import com.reservas.parqueaderos.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public String registrar(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return "Error: El email ya está registrado";
        }

        // Encriptar contraseña antes de guardar
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);

        System.out.println("LOG: Enviando correo de bienvenida a " + user.getEmail());
        return "Usuario registrado con éxito";
    }

    public User login(String email, String password) {
        return userRepository.findByEmail(email)
                .filter(u -> passwordEncoder.matches(password, u.getPassword()))
                .orElse(null);
    }
}
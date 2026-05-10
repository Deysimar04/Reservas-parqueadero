package com.reservas.parqueaderos.service;

import com.reservas.parqueaderos.model.Users;
import com.reservas.parqueaderos.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // ✅ REGISTRO SEGURO
    public String registrar(Users user) {

        if (userRepository.existsByEmail(user.getEmail())) {
            return "Error: El email ya está registrado";
        }

        if (userRepository.existsByUsername(user.getUsername())) {
            return "Error: El username ya está en uso";
        }

        // 🔐 CIFRAR PASSWORD
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // asignar rol por defecto si no viene
        if (user.getRole() == null) {
            user.setRole("USER");
        }

        userRepository.save(user);

        // Simulación de notificación
        System.out.println("LOG: Enviando correo de bienvenida a " + user.getEmail());

        return "Usuario registrado con éxito";
    }

    // ✅ LOGIN CORRECTO (si decides usarlo desde aquí)
    public Users login(String email, String password) {

        return userRepository.findByEmail(email)
                .filter(user -> passwordEncoder.matches(password, user.getPassword()))
                .orElse(null);
    }
}
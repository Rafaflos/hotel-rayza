package com.hotel.backend.config;

import com.hotel.backend.entity.Rol;
import com.hotel.backend.entity.Usuario;
import com.hotel.backend.repository.RolRepository;
import com.hotel.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private static final String ADMIN_USERNAME = "admin";
    private static final String ADMIN_DEFAULT_PASSWORD = "admin123";

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (usuarioRepository.existsByUsername(ADMIN_USERNAME)) {
            return;
        }

        Rol adminRol = rolRepository.findByNombre("ADMIN")
                .orElseThrow(() -> new IllegalStateException(
                        "El rol ADMIN no existe. Ejecuta primero hotel_management.sql para crear los roles base."));

        Usuario admin = Usuario.builder()
                .username(ADMIN_USERNAME)
                .password(passwordEncoder.encode(ADMIN_DEFAULT_PASSWORD))
                .nombres("Administrador")
                .apellidos("Sistema")
                .activo(true)
                .roles(Set.of(adminRol))
                .build();

        usuarioRepository.save(admin);

        log.warn("Usuario admin creado con contraseña por defecto '{}'. Cámbiala después del primer login.",
                ADMIN_DEFAULT_PASSWORD);
    }
}

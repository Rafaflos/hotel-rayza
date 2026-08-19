package com.hotel.backend.dto.usuario;

import java.time.LocalDateTime;
import java.util.List;

public record UsuarioResponse(
        Long id,
        String username,
        String nombres,
        String apellidos,
        String correo,
        String telefono,
        Boolean activo,
        LocalDateTime ultimoLogin,
        List<RolResumen> roles
) {
    public record RolResumen(Long id, String nombre) {
    }
}

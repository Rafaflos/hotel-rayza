package com.hotel.backend.dto.usuario;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.Set;

public record UsuarioRequest(
        @NotBlank(message = "El usuario es obligatorio") String username,
        // Opcional al editar (si viene vacío, no se cambia la contraseña)
        String password,
        @NotBlank(message = "Los nombres son obligatorios") String nombres,
        @NotBlank(message = "Los apellidos son obligatorios") String apellidos,
        @Email(message = "El correo no es válido") String correo,
        String telefono,
        Boolean activo,
        @NotEmpty(message = "Debe asignar al menos un rol") Set<Long> rolesIds
) {
}

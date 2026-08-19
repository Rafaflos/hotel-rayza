package com.hotel.backend.dto.empleado;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public record EmpleadoRequest(
        @NotBlank(message = "El tipo de documento es obligatorio") String tipoDocumento,
        @NotBlank(message = "El número de documento es obligatorio") String numeroDocumento,
        @NotBlank(message = "Los nombres son obligatorios") String nombres,
        @NotBlank(message = "Los apellidos son obligatorios") String apellidos,
        String telefono,
        @Email(message = "El correo no es válido") String correo,
        String cargo,
        LocalDate fechaIngreso,
        Boolean activo
) {
}

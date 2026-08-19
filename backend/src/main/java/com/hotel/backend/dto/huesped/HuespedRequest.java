package com.hotel.backend.dto.huesped;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;

import java.time.LocalDate;

public record HuespedRequest(
        @NotBlank(message = "El tipo de documento es obligatorio") String tipoDocumento,
        @NotBlank(message = "El número de documento es obligatorio") String numeroDocumento,
        @NotBlank(message = "Los nombres son obligatorios") String nombres,
        @NotBlank(message = "Los apellidos son obligatorios") String apellidos,
        String telefono,
        @Email(message = "El correo no es válido") String correo,
        String nacionalidad,
        String direccion,
        @Past(message = "La fecha de nacimiento debe ser en el pasado") LocalDate fechaNacimiento
) {
}

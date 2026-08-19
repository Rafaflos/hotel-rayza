package com.hotel.backend.dto.huesped;

import java.time.LocalDate;

public record HuespedResponse(
        Long id,
        String tipoDocumento,
        String numeroDocumento,
        String nombres,
        String apellidos,
        String telefono,
        String correo,
        String nacionalidad,
        String direccion,
        LocalDate fechaNacimiento
) {
}

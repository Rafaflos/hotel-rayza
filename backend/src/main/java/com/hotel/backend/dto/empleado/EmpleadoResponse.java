package com.hotel.backend.dto.empleado;

import java.time.LocalDate;

public record EmpleadoResponse(
        Long id,
        String tipoDocumento,
        String numeroDocumento,
        String nombres,
        String apellidos,
        String telefono,
        String correo,
        String cargo,
        LocalDate fechaIngreso,
        Boolean activo
) {
}

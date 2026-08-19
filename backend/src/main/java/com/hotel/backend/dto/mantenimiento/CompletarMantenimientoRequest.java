package com.hotel.backend.dto.mantenimiento;

import jakarta.validation.constraints.NotBlank;

public record CompletarMantenimientoRequest(
        @NotBlank(message = "Describe la solución aplicada") String solucion
) {
}

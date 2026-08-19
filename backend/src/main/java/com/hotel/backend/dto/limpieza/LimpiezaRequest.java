package com.hotel.backend.dto.limpieza;

import jakarta.validation.constraints.NotNull;

public record LimpiezaRequest(
        @NotNull(message = "La habitación es obligatoria") Long habitacionId,
        Long empleadoId,
        String observaciones
) {
}

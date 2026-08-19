package com.hotel.backend.dto.checkin;

import jakarta.validation.constraints.NotNull;

public record CheckinRequest(
        @NotNull(message = "La reserva es obligatoria") Long reservaId,
        boolean documentoVerificado,
        String observaciones
) {
}

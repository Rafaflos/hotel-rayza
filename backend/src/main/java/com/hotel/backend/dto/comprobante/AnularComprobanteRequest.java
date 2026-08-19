package com.hotel.backend.dto.comprobante;

import jakarta.validation.constraints.NotBlank;

public record AnularComprobanteRequest(
        @NotBlank(message = "El motivo de anulación es obligatorio") String motivo
) {
}

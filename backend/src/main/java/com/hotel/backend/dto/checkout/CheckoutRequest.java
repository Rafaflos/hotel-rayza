package com.hotel.backend.dto.checkout;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record CheckoutRequest(
        @NotNull(message = "La reserva es obligatoria") Long reservaId,
        @DecimalMin(value = "0", message = "El descuento no puede ser negativo") BigDecimal descuento,
        String observaciones
) {
}

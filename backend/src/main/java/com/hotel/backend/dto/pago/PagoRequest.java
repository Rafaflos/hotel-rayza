package com.hotel.backend.dto.pago;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record PagoRequest(
        Long reservaId,
        Long checkoutId,
        @NotNull(message = "El método de pago es obligatorio") Long metodoPagoId,
        @NotNull @Positive(message = "El monto debe ser mayor a 0") BigDecimal monto,
        String referencia,
        String observaciones
) {
}

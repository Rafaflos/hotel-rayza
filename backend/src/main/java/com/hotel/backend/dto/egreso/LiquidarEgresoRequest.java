package com.hotel.backend.dto.egreso;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record LiquidarEgresoRequest(
        @NotNull @Positive(message = "El monto real debe ser mayor a 0") BigDecimal montoReal,
        String comprobanteReferencia,
        String observaciones
) {
}

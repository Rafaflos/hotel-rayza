package com.hotel.backend.dto.caja;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record CerrarCajaRequest(
        @NotNull @DecimalMin(value = "0", message = "El monto contado no puede ser negativo") BigDecimal montoContado,
        String observaciones
) {
}

package com.hotel.backend.dto.caja;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record AbrirCajaRequest(
        @NotNull @DecimalMin(value = "0", message = "El monto inicial no puede ser negativo") BigDecimal montoInicial,
        String observaciones
) {
}

package com.hotel.backend.dto.egreso;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record SolicitudEgresoRequest(
        @NotBlank(message = "Describe para qué es el gasto") String concepto,
        @NotNull @Positive(message = "El monto debe ser mayor a 0") BigDecimal montoEstimado,
        String observaciones
) {
}

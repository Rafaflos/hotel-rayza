package com.hotel.backend.dto.consumo;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record ConsumoRequest(
        @NotNull(message = "La reserva es obligatoria") Long reservaId,
        Long servicioId,
        @NotBlank(message = "La descripción es obligatoria") String descripcion,
        @NotNull @Positive(message = "La cantidad debe ser mayor a 0") BigDecimal cantidad,
        @NotNull @DecimalMin(value = "0", message = "El precio no puede ser negativo") BigDecimal precioUnitario
) {
}

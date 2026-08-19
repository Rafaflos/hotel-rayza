package com.hotel.backend.dto.tipohabitacion;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record TipoHabitacionRequest(
        @NotBlank(message = "El nombre es obligatorio") String nombre,
        String descripcion,
        @NotNull @Positive(message = "La capacidad debe ser mayor a 0") Integer capacidad,
        @NotNull @DecimalMin(value = "0", message = "El precio no puede ser negativo") BigDecimal precioNoche
) {
}

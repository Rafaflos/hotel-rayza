package com.hotel.backend.dto.habitacion;

import com.hotel.backend.entity.EstadoHabitacion;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;

public record HabitacionRequest(
        @NotBlank(message = "El número es obligatorio") String numero,
        @NotNull @PositiveOrZero(message = "El piso no puede ser negativo") Integer piso,
        @NotNull(message = "El tipo de habitación es obligatorio") Long tipoId,
        @NotNull @Positive(message = "La capacidad debe ser mayor a 0") Integer capacidad,
        @NotNull @DecimalMin(value = "0", message = "El precio no puede ser negativo") BigDecimal precioNoche,
        EstadoHabitacion estado,
        String descripcion
) {
}

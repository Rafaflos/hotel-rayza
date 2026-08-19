package com.hotel.backend.dto.reserva;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ReservaRequest(
        @NotNull(message = "El huésped principal es obligatorio") Long huespedPrincipalId,
        @NotNull(message = "La habitación es obligatoria") Long habitacionId,
        @NotNull @FutureOrPresent(message = "La fecha de entrada no puede ser en el pasado") LocalDate fechaEntrada,
        @NotNull LocalDate fechaSalida,
        @NotNull @Positive(message = "La cantidad de huéspedes debe ser mayor a 0") Integer cantidadHuespedes,
        @DecimalMin(value = "0", message = "El descuento no puede ser negativo") BigDecimal descuento,
        String observaciones
) {
}

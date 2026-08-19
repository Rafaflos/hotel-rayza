package com.hotel.backend.dto.reserva;

import com.hotel.backend.dto.habitacion.HabitacionResponse;
import com.hotel.backend.dto.huesped.HuespedResponse;
import com.hotel.backend.entity.EstadoReserva;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ReservaResponse(
        Long id,
        String codigo,
        HuespedResponse huespedPrincipal,
        HabitacionResponse habitacion,
        LocalDate fechaEntrada,
        LocalDate fechaSalida,
        Integer cantidadHuespedes,
        BigDecimal precioNoche,
        Integer cantidadNoches,
        BigDecimal descuento,
        BigDecimal subtotal,
        BigDecimal total,
        EstadoReserva estado,
        String observaciones
) {
}

package com.hotel.backend.dto.checkout;

import com.hotel.backend.dto.habitacion.HabitacionResponse;
import com.hotel.backend.dto.huesped.HuespedResponse;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CheckoutResponse(
        Long id,
        Long reservaId,
        String reservaCodigo,
        HuespedResponse huesped,
        HabitacionResponse habitacion,
        LocalDateTime fechaHora,
        BigDecimal subtotalHospedaje,
        BigDecimal subtotalConsumos,
        BigDecimal subtotalServicios,
        BigDecimal descuento,
        BigDecimal total,
        String observaciones
) {
}

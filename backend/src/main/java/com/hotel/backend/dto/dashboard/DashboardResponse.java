package com.hotel.backend.dto.dashboard;

import java.math.BigDecimal;

public record DashboardResponse(
        long habitacionesDisponibles,
        long habitacionesOcupadas,
        long habitacionesReservadas,
        long habitacionesLimpieza,
        long habitacionesMantenimiento,
        long reservasHoy,
        long checkinsHoy,
        long checkoutsHoy,
        BigDecimal ingresosHoy
) {
}

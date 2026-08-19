package com.hotel.backend.dto.reporte;

import com.hotel.backend.dto.caja.CajaResponse;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public record ReporteResumenResponse(
        LocalDate desde,
        LocalDate hasta,
        long totalHabitaciones,
        long habitacionesOcupadasActual,
        long totalReservas,
        Map<String, Long> reservasPorEstado,
        long cancelaciones,
        long checkins,
        long checkouts,
        BigDecimal ingresosTotal,
        Map<String, BigDecimal> ingresosPorMetodo,
        List<CajaResponse> cajas
) {
}

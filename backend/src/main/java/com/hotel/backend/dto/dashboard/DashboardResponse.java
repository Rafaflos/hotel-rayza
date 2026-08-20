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
        BigDecimal ingresosHoy,
        /** Porcentaje de habitaciones ocupadas ahora mismo. */
        int tasaOcupacion,
        /** Huéspedes que ya pasaron su hora límite de salida. */
        long estanciasVencidas,
        /** Total que esas estancias vencidas tienen por cobrar. */
        BigDecimal porCobrarVencidas,
        /** Solicitudes de caja chica esperando aprobación. */
        long egresosPendientes,
        /** Avisos internos que el usuario actual no ha leído. */
        long avisosNoLeidos
) {
}

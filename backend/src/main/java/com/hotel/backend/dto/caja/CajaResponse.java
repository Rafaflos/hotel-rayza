package com.hotel.backend.dto.caja;

import com.hotel.backend.entity.EstadoCaja;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record CajaResponse(
        Long id,
        LocalDate fecha,
        String usuarioApertura,
        String usuarioCierre,
        BigDecimal montoInicial,
        BigDecimal montoFinal,
        BigDecimal totalIngresos,
        BigDecimal totalEgresos,
        BigDecimal diferencia,
        EstadoCaja estado,
        LocalDateTime fechaApertura,
        LocalDateTime fechaCierre,
        String observaciones,
        /** Lo que debería haber en caja: inicial + ingresos - egresos. */
        BigDecimal efectivoEsperado,
        /** true si el turno lo abrió el usuario que está consultando. */
        boolean miTurno
) {
}

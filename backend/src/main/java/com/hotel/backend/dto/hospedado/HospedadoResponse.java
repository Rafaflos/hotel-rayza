package com.hotel.backend.dto.hospedado;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Vista operativa de una estancia en curso: cuánto debe el huésped y si ya se
 * pasó de su hora de salida.
 */
public record HospedadoResponse(
        Long reservaId,
        String codigo,
        String habitacionNumero,
        String huespedNombre,
        String huespedDocumento,
        LocalDate fechaEntrada,
        LocalDate fechaSalida,
        LocalTime horaLimiteSalida,
        int diasTranscurridos,
        int diasExtra,
        BigDecimal cargoExtra,
        BigDecimal totalHospedaje,
        BigDecimal totalConsumos,
        BigDecimal totalCuenta,
        BigDecimal totalPagado,
        BigDecimal saldoPendiente,
        boolean vencida,
        String estadoOperativo
) {
}

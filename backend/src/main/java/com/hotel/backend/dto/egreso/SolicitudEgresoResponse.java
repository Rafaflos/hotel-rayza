package com.hotel.backend.dto.egreso;

import com.hotel.backend.entity.EstadoSolicitudEgreso;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record SolicitudEgresoResponse(
        Long id,
        String concepto,
        BigDecimal montoEstimado,
        BigDecimal montoReal,
        EstadoSolicitudEgreso estado,
        String comprobanteReferencia,
        String observaciones,
        String solicitante,
        String aprobador,
        LocalDateTime fechaSolicitud,
        LocalDateTime fechaResolucion,
        LocalDateTime fechaLiquidacion
) {
}

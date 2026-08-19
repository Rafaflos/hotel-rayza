package com.hotel.backend.dto.caja;

import com.hotel.backend.entity.TipoMovimiento;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record MovimientoCajaResponse(
        Long id,
        TipoMovimiento tipo,
        String concepto,
        BigDecimal monto,
        Long pagoId,
        LocalDateTime fechaHora,
        String observaciones
) {
}

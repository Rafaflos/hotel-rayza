package com.hotel.backend.dto.pago;

import com.hotel.backend.entity.EstadoPago;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PagoResponse(
        Long id,
        Long reservaId,
        String reservaCodigo,
        Long checkoutId,
        String metodoPago,
        BigDecimal monto,
        String referencia,
        LocalDateTime fechaHora,
        EstadoPago estado,
        String observaciones
) {
}

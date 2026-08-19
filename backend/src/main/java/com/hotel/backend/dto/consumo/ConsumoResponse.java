package com.hotel.backend.dto.consumo;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ConsumoResponse(
        Long id,
        Long reservaId,
        String servicioNombre,
        String descripcion,
        BigDecimal cantidad,
        BigDecimal precioUnitario,
        BigDecimal subtotal,
        LocalDateTime fechaHora
) {
}

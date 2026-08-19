package com.hotel.backend.dto.comprobante;

import com.hotel.backend.entity.TipoComprobante;
import jakarta.validation.constraints.NotNull;

public record ComprobanteRequest(
        @NotNull(message = "El check-out es obligatorio") Long checkoutId,
        @NotNull(message = "El tipo de comprobante es obligatorio") TipoComprobante tipo,
        String observaciones
) {
}

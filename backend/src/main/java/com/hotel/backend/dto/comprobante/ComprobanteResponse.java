package com.hotel.backend.dto.comprobante;

import com.hotel.backend.entity.EstadoComprobante;
import com.hotel.backend.entity.TipoComprobante;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ComprobanteResponse(
        Long id,
        TipoComprobante tipo,
        String serie,
        String numero,
        LocalDateTime fechaEmision,
        String clienteTipoDocumento,
        String clienteNumeroDocumento,
        String clienteNombre,
        String reservaCodigo,
        String habitacionNumero,
        BigDecimal subtotal,
        BigDecimal descuento,
        BigDecimal impuesto,
        BigDecimal total,
        EstadoComprobante estado,
        String observaciones,
        Boolean sunatAceptada,
        String sunatDescripcion,
        String sunatEnlacePdf
) {
}

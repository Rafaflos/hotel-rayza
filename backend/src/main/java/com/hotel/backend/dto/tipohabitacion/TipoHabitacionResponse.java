package com.hotel.backend.dto.tipohabitacion;

import java.math.BigDecimal;

public record TipoHabitacionResponse(
        Long id,
        String nombre,
        String descripcion,
        Integer capacidad,
        BigDecimal precioNoche,
        Boolean activo
) {
}

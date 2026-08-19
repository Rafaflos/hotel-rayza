package com.hotel.backend.dto.habitacion;

import com.hotel.backend.dto.tipohabitacion.TipoHabitacionResponse;
import com.hotel.backend.entity.EstadoHabitacion;

import java.math.BigDecimal;

public record HabitacionResponse(
        Long id,
        String numero,
        Integer piso,
        TipoHabitacionResponse tipo,
        Integer capacidad,
        BigDecimal precioNoche,
        EstadoHabitacion estado,
        String descripcion
) {
}

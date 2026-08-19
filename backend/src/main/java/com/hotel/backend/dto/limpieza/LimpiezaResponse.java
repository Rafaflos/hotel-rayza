package com.hotel.backend.dto.limpieza;

import com.hotel.backend.dto.habitacion.HabitacionResponse;
import com.hotel.backend.entity.EstadoLimpieza;

import java.time.LocalDateTime;

public record LimpiezaResponse(
        Long id,
        HabitacionResponse habitacion,
        LocalDateTime fechaHora,
        EstadoLimpieza estado,
        Long empleadoId,
        String empleadoNombre,
        String observaciones,
        LocalDateTime fechaCompletada
) {
}

package com.hotel.backend.dto.mantenimiento;

import com.hotel.backend.dto.habitacion.HabitacionResponse;
import com.hotel.backend.entity.EstadoMantenimiento;
import com.hotel.backend.entity.Prioridad;

import java.time.LocalDateTime;

public record MantenimientoResponse(
        Long id,
        HabitacionResponse habitacion,
        String problema,
        Prioridad prioridad,
        EstadoMantenimiento estado,
        Long responsableId,
        String responsableNombre,
        LocalDateTime fecha,
        LocalDateTime fechaSolucion,
        String solucion,
        String observaciones
) {
}

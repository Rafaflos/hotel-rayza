package com.hotel.backend.dto.mantenimiento;

import com.hotel.backend.entity.Prioridad;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record MantenimientoRequest(
        @NotNull(message = "La habitación es obligatoria") Long habitacionId,
        @NotBlank(message = "Describe el problema") String problema,
        Prioridad prioridad,
        Long responsableId,
        String observaciones
) {
}

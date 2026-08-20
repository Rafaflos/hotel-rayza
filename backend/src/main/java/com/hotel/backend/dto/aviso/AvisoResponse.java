package com.hotel.backend.dto.aviso;

import com.hotel.backend.entity.CategoriaAviso;
import com.hotel.backend.entity.PrioridadAviso;

import java.time.LocalDateTime;

public record AvisoResponse(
        Long id,
        CategoriaAviso categoria,
        String asunto,
        String mensaje,
        PrioridadAviso prioridad,
        String autor,
        String habitacionNumero,
        boolean resuelto,
        boolean leido,
        LocalDateTime fechaHora
) {
}

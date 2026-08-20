package com.hotel.backend.dto.aviso;

import com.hotel.backend.entity.CategoriaAviso;
import com.hotel.backend.entity.PrioridadAviso;
import jakarta.validation.constraints.NotBlank;

public record AvisoRequest(
        CategoriaAviso categoria,
        @NotBlank(message = "El asunto es obligatorio") String asunto,
        @NotBlank(message = "El mensaje es obligatorio") String mensaje,
        PrioridadAviso prioridad,
        Long habitacionId
) {
}

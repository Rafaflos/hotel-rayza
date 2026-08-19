package com.hotel.backend.dto.consumo;

import java.math.BigDecimal;

public record ServicioResponse(Long id, String nombre, String descripcion, BigDecimal precio) {
}

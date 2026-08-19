package com.hotel.backend.dto.checkin;

import com.hotel.backend.dto.habitacion.HabitacionResponse;
import com.hotel.backend.dto.huesped.HuespedResponse;

import java.time.LocalDateTime;

public record CheckinResponse(
        Long id,
        Long reservaId,
        String reservaCodigo,
        HuespedResponse huesped,
        HabitacionResponse habitacion,
        LocalDateTime fechaHora,
        Boolean documentoVerificado,
        String observaciones
) {
}

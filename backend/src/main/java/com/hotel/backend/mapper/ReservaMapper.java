package com.hotel.backend.mapper;

import com.hotel.backend.dto.reserva.ReservaResponse;
import com.hotel.backend.entity.Reserva;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ReservaMapper {

    private final HuespedMapper huespedMapper;
    private final HabitacionMapper habitacionMapper;

    public ReservaResponse toResponse(Reserva reserva) {
        return new ReservaResponse(
                reserva.getId(),
                reserva.getCodigo(),
                huespedMapper.toResponse(reserva.getHuespedPrincipal()),
                habitacionMapper.toResponse(reserva.getHabitacion()),
                reserva.getFechaEntrada(),
                reserva.getFechaSalida(),
                reserva.getCantidadHuespedes(),
                reserva.getPrecioNoche(),
                reserva.getCantidadNoches(),
                reserva.getDescuento(),
                reserva.getSubtotal(),
                reserva.getTotal(),
                reserva.getEstado(),
                reserva.getObservaciones()
        );
    }
}

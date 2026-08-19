package com.hotel.backend.mapper;

import com.hotel.backend.dto.habitacion.HabitacionRequest;
import com.hotel.backend.dto.habitacion.HabitacionResponse;
import com.hotel.backend.entity.EstadoHabitacion;
import com.hotel.backend.entity.Habitacion;
import com.hotel.backend.entity.TipoHabitacion;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class HabitacionMapper {

    private final TipoHabitacionMapper tipoHabitacionMapper;

    public Habitacion toEntity(HabitacionRequest request, TipoHabitacion tipo) {
        return Habitacion.builder()
                .numero(request.numero())
                .piso(request.piso())
                .tipo(tipo)
                .capacidad(request.capacidad())
                .precioNoche(request.precioNoche())
                .estado(request.estado() != null ? request.estado() : EstadoHabitacion.DISPONIBLE)
                .descripcion(request.descripcion())
                .build();
    }

    public void updateEntity(Habitacion habitacion, HabitacionRequest request, TipoHabitacion tipo) {
        habitacion.setNumero(request.numero());
        habitacion.setPiso(request.piso());
        habitacion.setTipo(tipo);
        habitacion.setCapacidad(request.capacidad());
        habitacion.setPrecioNoche(request.precioNoche());
        if (request.estado() != null) {
            habitacion.setEstado(request.estado());
        }
        habitacion.setDescripcion(request.descripcion());
    }

    public HabitacionResponse toResponse(Habitacion habitacion) {
        return new HabitacionResponse(
                habitacion.getId(),
                habitacion.getNumero(),
                habitacion.getPiso(),
                tipoHabitacionMapper.toResponse(habitacion.getTipo()),
                habitacion.getCapacidad(),
                habitacion.getPrecioNoche(),
                habitacion.getEstado(),
                habitacion.getDescripcion()
        );
    }
}

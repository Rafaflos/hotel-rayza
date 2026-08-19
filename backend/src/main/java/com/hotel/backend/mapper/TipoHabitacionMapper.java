package com.hotel.backend.mapper;

import com.hotel.backend.dto.tipohabitacion.TipoHabitacionRequest;
import com.hotel.backend.dto.tipohabitacion.TipoHabitacionResponse;
import com.hotel.backend.entity.TipoHabitacion;
import org.springframework.stereotype.Component;

@Component
public class TipoHabitacionMapper {

    public TipoHabitacion toEntity(TipoHabitacionRequest request) {
        return TipoHabitacion.builder()
                .nombre(request.nombre())
                .descripcion(request.descripcion())
                .capacidad(request.capacidad())
                .precioNoche(request.precioNoche())
                .build();
    }

    public void updateEntity(TipoHabitacion tipo, TipoHabitacionRequest request) {
        tipo.setNombre(request.nombre());
        tipo.setDescripcion(request.descripcion());
        tipo.setCapacidad(request.capacidad());
        tipo.setPrecioNoche(request.precioNoche());
    }

    public TipoHabitacionResponse toResponse(TipoHabitacion tipo) {
        return new TipoHabitacionResponse(
                tipo.getId(),
                tipo.getNombre(),
                tipo.getDescripcion(),
                tipo.getCapacidad(),
                tipo.getPrecioNoche(),
                tipo.getActivo()
        );
    }
}

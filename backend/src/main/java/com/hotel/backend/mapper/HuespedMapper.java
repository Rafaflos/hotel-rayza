package com.hotel.backend.mapper;

import com.hotel.backend.dto.huesped.HuespedRequest;
import com.hotel.backend.dto.huesped.HuespedResponse;
import com.hotel.backend.entity.Huesped;
import org.springframework.stereotype.Component;

@Component
public class HuespedMapper {

    public Huesped toEntity(HuespedRequest request) {
        return Huesped.builder()
                .tipoDocumento(request.tipoDocumento())
                .numeroDocumento(request.numeroDocumento())
                .nombres(request.nombres())
                .apellidos(request.apellidos())
                .telefono(request.telefono())
                .correo(request.correo())
                .nacionalidad(request.nacionalidad())
                .direccion(request.direccion())
                .fechaNacimiento(request.fechaNacimiento())
                .build();
    }

    public void updateEntity(Huesped huesped, HuespedRequest request) {
        huesped.setTipoDocumento(request.tipoDocumento());
        huesped.setNumeroDocumento(request.numeroDocumento());
        huesped.setNombres(request.nombres());
        huesped.setApellidos(request.apellidos());
        huesped.setTelefono(request.telefono());
        huesped.setCorreo(request.correo());
        huesped.setNacionalidad(request.nacionalidad());
        huesped.setDireccion(request.direccion());
        huesped.setFechaNacimiento(request.fechaNacimiento());
    }

    public HuespedResponse toResponse(Huesped huesped) {
        return new HuespedResponse(
                huesped.getId(),
                huesped.getTipoDocumento(),
                huesped.getNumeroDocumento(),
                huesped.getNombres(),
                huesped.getApellidos(),
                huesped.getTelefono(),
                huesped.getCorreo(),
                huesped.getNacionalidad(),
                huesped.getDireccion(),
                huesped.getFechaNacimiento()
        );
    }
}

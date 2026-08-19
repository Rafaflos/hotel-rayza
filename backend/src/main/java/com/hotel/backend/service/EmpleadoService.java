package com.hotel.backend.service;

import com.hotel.backend.dto.empleado.EmpleadoRequest;
import com.hotel.backend.dto.empleado.EmpleadoResponse;
import com.hotel.backend.entity.Empleado;
import com.hotel.backend.exception.BusinessException;
import com.hotel.backend.exception.ResourceNotFoundException;
import com.hotel.backend.repository.EmpleadoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpleadoService {

    private final EmpleadoRepository repository;

    public List<EmpleadoResponse> findAll() {
        return repository.findAll().stream().map(this::toResponse).toList();
    }

    public List<EmpleadoResponse> findActivos() {
        return repository.findByActivoTrueOrderByApellidosAsc().stream().map(this::toResponse).toList();
    }

    public EmpleadoResponse findById(Long id) {
        return toResponse(getEntity(id));
    }

    @Transactional
    public EmpleadoResponse create(EmpleadoRequest request) {
        if (repository.existsByNumeroDocumento(request.numeroDocumento())) {
            throw new BusinessException("Ya existe un empleado con el documento " + request.numeroDocumento());
        }
        Empleado empleado = Empleado.builder()
                .tipoDocumento(request.tipoDocumento())
                .numeroDocumento(request.numeroDocumento())
                .nombres(request.nombres())
                .apellidos(request.apellidos())
                .telefono(request.telefono())
                .correo(request.correo())
                .cargo(request.cargo())
                .fechaIngreso(request.fechaIngreso())
                .activo(request.activo() == null || request.activo())
                .build();
        return toResponse(repository.save(empleado));
    }

    @Transactional
    public EmpleadoResponse update(Long id, EmpleadoRequest request) {
        Empleado empleado = getEntity(id);
        if (!empleado.getNumeroDocumento().equals(request.numeroDocumento())
                && repository.existsByNumeroDocumento(request.numeroDocumento())) {
            throw new BusinessException("Ya existe un empleado con el documento " + request.numeroDocumento());
        }
        empleado.setTipoDocumento(request.tipoDocumento());
        empleado.setNumeroDocumento(request.numeroDocumento());
        empleado.setNombres(request.nombres());
        empleado.setApellidos(request.apellidos());
        empleado.setTelefono(request.telefono());
        empleado.setCorreo(request.correo());
        empleado.setCargo(request.cargo());
        empleado.setFechaIngreso(request.fechaIngreso());
        if (request.activo() != null) {
            empleado.setActivo(request.activo());
        }
        return toResponse(repository.save(empleado));
    }

    @Transactional
    public void desactivar(Long id) {
        Empleado empleado = getEntity(id);
        empleado.setActivo(false);
        repository.save(empleado);
    }

    private EmpleadoResponse toResponse(Empleado e) {
        return new EmpleadoResponse(
                e.getId(),
                e.getTipoDocumento(),
                e.getNumeroDocumento(),
                e.getNombres(),
                e.getApellidos(),
                e.getTelefono(),
                e.getCorreo(),
                e.getCargo(),
                e.getFechaIngreso(),
                e.getActivo()
        );
    }

    private Empleado getEntity(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Empleado no encontrado: " + id));
    }
}

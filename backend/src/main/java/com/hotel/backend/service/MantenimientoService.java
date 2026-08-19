package com.hotel.backend.service;

import com.hotel.backend.dto.mantenimiento.CompletarMantenimientoRequest;
import com.hotel.backend.dto.mantenimiento.MantenimientoRequest;
import com.hotel.backend.dto.mantenimiento.MantenimientoResponse;
import com.hotel.backend.entity.Empleado;
import com.hotel.backend.entity.EstadoHabitacion;
import com.hotel.backend.entity.EstadoMantenimiento;
import com.hotel.backend.entity.Habitacion;
import com.hotel.backend.entity.Mantenimiento;
import com.hotel.backend.entity.Prioridad;
import com.hotel.backend.exception.BusinessException;
import com.hotel.backend.exception.ResourceNotFoundException;
import com.hotel.backend.mapper.HabitacionMapper;
import com.hotel.backend.repository.EmpleadoRepository;
import com.hotel.backend.repository.HabitacionRepository;
import com.hotel.backend.repository.MantenimientoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MantenimientoService {

    private final MantenimientoRepository repository;
    private final HabitacionRepository habitacionRepository;
    private final EmpleadoRepository empleadoRepository;
    private final CurrentUserService currentUserService;
    private final HabitacionMapper habitacionMapper;

    public List<MantenimientoResponse> findPendientes() {
        return repository.findByEstadoInOrderByPrioridadDescFechaAsc(List.of(EstadoMantenimiento.PENDIENTE, EstadoMantenimiento.EN_PROCESO))
                .stream().map(this::toResponse).toList();
    }

    public List<MantenimientoResponse> findAll() {
        return repository.findAllByOrderByFechaDesc().stream().map(this::toResponse).toList();
    }

    @Transactional
    public MantenimientoResponse create(MantenimientoRequest request) {
        Habitacion habitacion = habitacionRepository.findById(request.habitacionId())
                .orElseThrow(() -> new ResourceNotFoundException("Habitación no encontrada: " + request.habitacionId()));

        Empleado responsable = request.responsableId() != null
                ? empleadoRepository.findById(request.responsableId())
                    .orElseThrow(() -> new ResourceNotFoundException("Empleado no encontrado: " + request.responsableId()))
                : null;

        Mantenimiento mantenimiento = Mantenimiento.builder()
                .habitacion(habitacion)
                .problema(request.problema())
                .prioridad(request.prioridad() != null ? request.prioridad() : Prioridad.MEDIA)
                .responsable(responsable)
                .observaciones(request.observaciones())
                .usuario(currentUserService.getUsuario())
                .build();

        habitacion.setEstado(EstadoHabitacion.MANTENIMIENTO);
        habitacionRepository.save(habitacion);

        return toResponse(repository.save(mantenimiento));
    }

    @Transactional
    public MantenimientoResponse iniciar(Long id) {
        Mantenimiento mantenimiento = getEntity(id);
        if (mantenimiento.getEstado() != EstadoMantenimiento.PENDIENTE) {
            throw new BusinessException("Solo un mantenimiento PENDIENTE puede iniciarse");
        }
        mantenimiento.setEstado(EstadoMantenimiento.EN_PROCESO);
        return toResponse(repository.save(mantenimiento));
    }

    @Transactional
    public MantenimientoResponse completar(Long id, CompletarMantenimientoRequest request) {
        Mantenimiento mantenimiento = getEntity(id);
        if (mantenimiento.getEstado() == EstadoMantenimiento.COMPLETADO || mantenimiento.getEstado() == EstadoMantenimiento.CANCELADO) {
            throw new BusinessException("Este mantenimiento ya está cerrado");
        }
        mantenimiento.setEstado(EstadoMantenimiento.COMPLETADO);
        mantenimiento.setSolucion(request.solucion());
        mantenimiento.setFechaSolucion(LocalDateTime.now());
        Mantenimiento saved = repository.save(mantenimiento);

        liberarHabitacionSiCorresponde(mantenimiento.getHabitacion());

        return toResponse(saved);
    }

    @Transactional
    public MantenimientoResponse cancelar(Long id) {
        Mantenimiento mantenimiento = getEntity(id);
        if (mantenimiento.getEstado() == EstadoMantenimiento.COMPLETADO || mantenimiento.getEstado() == EstadoMantenimiento.CANCELADO) {
            throw new BusinessException("Este mantenimiento ya está cerrado");
        }
        mantenimiento.setEstado(EstadoMantenimiento.CANCELADO);
        Mantenimiento saved = repository.save(mantenimiento);

        liberarHabitacionSiCorresponde(mantenimiento.getHabitacion());

        return toResponse(saved);
    }

    private void liberarHabitacionSiCorresponde(Habitacion habitacion) {
        if (habitacion.getEstado() == EstadoHabitacion.MANTENIMIENTO) {
            habitacion.setEstado(EstadoHabitacion.DISPONIBLE);
            habitacionRepository.save(habitacion);
        }
    }

    private MantenimientoResponse toResponse(Mantenimiento mantenimiento) {
        Empleado responsable = mantenimiento.getResponsable();
        return new MantenimientoResponse(
                mantenimiento.getId(),
                habitacionMapper.toResponse(mantenimiento.getHabitacion()),
                mantenimiento.getProblema(),
                mantenimiento.getPrioridad(),
                mantenimiento.getEstado(),
                responsable != null ? responsable.getId() : null,
                responsable != null ? responsable.getNombres() + " " + responsable.getApellidos() : null,
                mantenimiento.getFecha(),
                mantenimiento.getFechaSolucion(),
                mantenimiento.getSolucion(),
                mantenimiento.getObservaciones()
        );
    }

    private Mantenimiento getEntity(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mantenimiento no encontrado: " + id));
    }
}

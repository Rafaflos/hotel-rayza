package com.hotel.backend.service;

import com.hotel.backend.dto.limpieza.LimpiezaRequest;
import com.hotel.backend.dto.limpieza.LimpiezaResponse;
import com.hotel.backend.entity.Empleado;
import com.hotel.backend.entity.EstadoHabitacion;
import com.hotel.backend.entity.EstadoLimpieza;
import com.hotel.backend.entity.Habitacion;
import com.hotel.backend.entity.Limpieza;
import com.hotel.backend.exception.BusinessException;
import com.hotel.backend.exception.ResourceNotFoundException;
import com.hotel.backend.mapper.HabitacionMapper;
import com.hotel.backend.repository.EmpleadoRepository;
import com.hotel.backend.repository.HabitacionRepository;
import com.hotel.backend.repository.LimpiezaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LimpiezaService {

    private final LimpiezaRepository repository;
    private final HabitacionRepository habitacionRepository;
    private final EmpleadoRepository empleadoRepository;
    private final CurrentUserService currentUserService;
    private final HabitacionMapper habitacionMapper;

    public List<LimpiezaResponse> findPendientes() {
        return repository.findByEstadoInOrderByFechaHoraAsc(List.of(EstadoLimpieza.PENDIENTE, EstadoLimpieza.EN_PROCESO))
                .stream().map(this::toResponse).toList();
    }

    public List<LimpiezaResponse> findAll() {
        return repository.findAllByOrderByFechaHoraDesc().stream().map(this::toResponse).toList();
    }

    @Transactional
    public LimpiezaResponse create(LimpiezaRequest request) {
        Habitacion habitacion = habitacionRepository.findById(request.habitacionId())
                .orElseThrow(() -> new ResourceNotFoundException("Habitación no encontrada: " + request.habitacionId()));

        Empleado empleado = request.empleadoId() != null
                ? empleadoRepository.findById(request.empleadoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Empleado no encontrado: " + request.empleadoId()))
                : null;

        Limpieza limpieza = Limpieza.builder()
                .habitacion(habitacion)
                .estado(EstadoLimpieza.PENDIENTE)
                .empleado(empleado)
                .observaciones(request.observaciones())
                .usuario(currentUserService.getUsuario())
                .build();

        if (habitacion.getEstado() != EstadoHabitacion.LIMPIEZA) {
            habitacion.setEstado(EstadoHabitacion.LIMPIEZA);
            habitacionRepository.save(habitacion);
        }

        return toResponse(repository.save(limpieza));
    }

    @Transactional
    public LimpiezaResponse iniciar(Long id) {
        Limpieza limpieza = getEntity(id);
        if (limpieza.getEstado() != EstadoLimpieza.PENDIENTE) {
            throw new BusinessException("Solo una limpieza PENDIENTE puede iniciarse");
        }
        limpieza.setEstado(EstadoLimpieza.EN_PROCESO);
        return toResponse(repository.save(limpieza));
    }

    @Transactional
    public LimpiezaResponse completar(Long id) {
        Limpieza limpieza = getEntity(id);
        if (limpieza.getEstado() == EstadoLimpieza.COMPLETADA) {
            throw new BusinessException("Esta limpieza ya está completada");
        }
        limpieza.setEstado(EstadoLimpieza.COMPLETADA);
        limpieza.setFechaCompletada(LocalDateTime.now());
        Limpieza saved = repository.save(limpieza);

        Habitacion habitacion = limpieza.getHabitacion();
        if (habitacion.getEstado() == EstadoHabitacion.LIMPIEZA) {
            habitacion.setEstado(EstadoHabitacion.DISPONIBLE);
            habitacionRepository.save(habitacion);
        }

        return toResponse(saved);
    }

    @Transactional
    public LimpiezaResponse observar(Long id, String observaciones) {
        Limpieza limpieza = getEntity(id);
        limpieza.setEstado(EstadoLimpieza.OBSERVADA);
        if (observaciones != null && !observaciones.isBlank()) {
            limpieza.setObservaciones(observaciones);
        }
        return toResponse(repository.save(limpieza));
    }

    private LimpiezaResponse toResponse(Limpieza limpieza) {
        Empleado empleado = limpieza.getEmpleado();
        return new LimpiezaResponse(
                limpieza.getId(),
                habitacionMapper.toResponse(limpieza.getHabitacion()),
                limpieza.getFechaHora(),
                limpieza.getEstado(),
                empleado != null ? empleado.getId() : null,
                empleado != null ? empleado.getNombres() + " " + empleado.getApellidos() : null,
                limpieza.getObservaciones(),
                limpieza.getFechaCompletada()
        );
    }

    private Limpieza getEntity(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Limpieza no encontrada: " + id));
    }
}

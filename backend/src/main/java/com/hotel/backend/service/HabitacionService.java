package com.hotel.backend.service;

import com.hotel.backend.dto.habitacion.HabitacionRequest;
import com.hotel.backend.dto.habitacion.HabitacionResponse;
import com.hotel.backend.entity.EstadoHabitacion;
import com.hotel.backend.entity.Habitacion;
import com.hotel.backend.entity.TipoHabitacion;
import com.hotel.backend.exception.BusinessException;
import com.hotel.backend.exception.ResourceNotFoundException;
import com.hotel.backend.mapper.HabitacionMapper;
import com.hotel.backend.repository.HabitacionRepository;
import com.hotel.backend.repository.TipoHabitacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class HabitacionService {

    private final HabitacionRepository repository;
    private final TipoHabitacionRepository tipoHabitacionRepository;
    private final HabitacionMapper mapper;

    public List<HabitacionResponse> findAll() {
        return repository.findAll().stream().map(mapper::toResponse).toList();
    }

    public List<HabitacionResponse> findByEstado(EstadoHabitacion estado) {
        return repository.findByEstado(estado).stream().map(mapper::toResponse).toList();
    }

    public HabitacionResponse findById(Long id) {
        return mapper.toResponse(getEntity(id));
    }

    @Transactional
    public HabitacionResponse create(HabitacionRequest request) {
        if (repository.existsByNumero(request.numero())) {
            throw new BusinessException("Ya existe una habitación con el número " + request.numero());
        }
        TipoHabitacion tipo = getTipo(request.tipoId());
        Habitacion habitacion = mapper.toEntity(request, tipo);
        return mapper.toResponse(repository.save(habitacion));
    }

    @Transactional
    public HabitacionResponse update(Long id, HabitacionRequest request) {
        Habitacion habitacion = getEntity(id);

        if (!habitacion.getNumero().equals(request.numero()) && repository.existsByNumero(request.numero())) {
            throw new BusinessException("Ya existe una habitación con el número " + request.numero());
        }

        TipoHabitacion tipo = getTipo(request.tipoId());
        mapper.updateEntity(habitacion, request, tipo);
        return mapper.toResponse(repository.save(habitacion));
    }

    @Transactional
    public void delete(Long id) {
        Habitacion habitacion = getEntity(id);
        habitacion.setEstado(EstadoHabitacion.FUERA_DE_SERVICIO);
        repository.save(habitacion);
    }

    private Habitacion getEntity(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Habitación no encontrada: " + id));
    }

    private TipoHabitacion getTipo(Long tipoId) {
        return tipoHabitacionRepository.findById(tipoId)
                .orElseThrow(() -> new ResourceNotFoundException("Tipo de habitación no encontrado: " + tipoId));
    }
}

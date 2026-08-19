package com.hotel.backend.service;

import com.hotel.backend.dto.tipohabitacion.TipoHabitacionRequest;
import com.hotel.backend.dto.tipohabitacion.TipoHabitacionResponse;
import com.hotel.backend.entity.TipoHabitacion;
import com.hotel.backend.exception.ResourceNotFoundException;
import com.hotel.backend.mapper.TipoHabitacionMapper;
import com.hotel.backend.repository.TipoHabitacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TipoHabitacionService {

    private final TipoHabitacionRepository repository;
    private final TipoHabitacionMapper mapper;

    public List<TipoHabitacionResponse> findAll() {
        return repository.findAll().stream().map(mapper::toResponse).toList();
    }

    public TipoHabitacionResponse findById(Long id) {
        return mapper.toResponse(getEntity(id));
    }

    @Transactional
    public TipoHabitacionResponse create(TipoHabitacionRequest request) {
        TipoHabitacion tipo = mapper.toEntity(request);
        return mapper.toResponse(repository.save(tipo));
    }

    @Transactional
    public TipoHabitacionResponse update(Long id, TipoHabitacionRequest request) {
        TipoHabitacion tipo = getEntity(id);
        mapper.updateEntity(tipo, request);
        return mapper.toResponse(repository.save(tipo));
    }

    @Transactional
    public void delete(Long id) {
        TipoHabitacion tipo = getEntity(id);
        tipo.setActivo(false);
        repository.save(tipo);
    }

    private TipoHabitacion getEntity(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tipo de habitación no encontrado: " + id));
    }
}

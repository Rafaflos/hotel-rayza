package com.hotel.backend.service;

import com.hotel.backend.dto.huesped.HuespedRequest;
import com.hotel.backend.dto.huesped.HuespedResponse;
import com.hotel.backend.entity.Huesped;
import com.hotel.backend.exception.BusinessException;
import com.hotel.backend.exception.ResourceNotFoundException;
import com.hotel.backend.mapper.HuespedMapper;
import com.hotel.backend.repository.HuespedRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class HuespedService {

    private final HuespedRepository repository;
    private final HuespedMapper mapper;

    public List<HuespedResponse> findAll() {
        return repository.findAll().stream().map(mapper::toResponse).toList();
    }

    public List<HuespedResponse> search(String query) {
        return repository.findByApellidosContainingIgnoreCaseOrNombresContainingIgnoreCase(query, query)
                .stream().map(mapper::toResponse).toList();
    }

    public HuespedResponse findById(Long id) {
        return mapper.toResponse(getEntity(id));
    }

    @Transactional
    public HuespedResponse create(HuespedRequest request) {
        if (repository.existsByNumeroDocumento(request.numeroDocumento())) {
            throw new BusinessException("Ya existe un huésped con el documento " + request.numeroDocumento());
        }
        Huesped huesped = mapper.toEntity(request);
        return mapper.toResponse(repository.save(huesped));
    }

    @Transactional
    public HuespedResponse update(Long id, HuespedRequest request) {
        Huesped huesped = getEntity(id);

        if (!huesped.getNumeroDocumento().equals(request.numeroDocumento())
                && repository.existsByNumeroDocumento(request.numeroDocumento())) {
            throw new BusinessException("Ya existe un huésped con el documento " + request.numeroDocumento());
        }

        mapper.updateEntity(huesped, request);
        return mapper.toResponse(repository.save(huesped));
    }

    @Transactional
    public void delete(Long id) {
        Huesped huesped = getEntity(id);
        huesped.setActivo(false);
        repository.save(huesped);
    }

    private Huesped getEntity(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Huésped no encontrado: " + id));
    }
}

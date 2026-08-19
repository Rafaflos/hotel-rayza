package com.hotel.backend.controller;

import com.hotel.backend.dto.tipohabitacion.TipoHabitacionRequest;
import com.hotel.backend.dto.tipohabitacion.TipoHabitacionResponse;
import com.hotel.backend.service.TipoHabitacionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tipos-habitacion")
@RequiredArgsConstructor
public class TipoHabitacionController {

    private final TipoHabitacionService service;

    @GetMapping
    public List<TipoHabitacionResponse> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public TipoHabitacionResponse findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TipoHabitacionResponse create(@Valid @RequestBody TipoHabitacionRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public TipoHabitacionResponse update(@PathVariable Long id, @Valid @RequestBody TipoHabitacionRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}

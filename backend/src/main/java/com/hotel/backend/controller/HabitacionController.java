package com.hotel.backend.controller;

import com.hotel.backend.dto.habitacion.HabitacionRequest;
import com.hotel.backend.dto.habitacion.HabitacionResponse;
import com.hotel.backend.entity.EstadoHabitacion;
import com.hotel.backend.service.HabitacionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/habitaciones")
@RequiredArgsConstructor
public class HabitacionController {

    private final HabitacionService service;

    @GetMapping
    public List<HabitacionResponse> findAll(@RequestParam(required = false) EstadoHabitacion estado) {
        return estado != null ? service.findByEstado(estado) : service.findAll();
    }

    @GetMapping("/{id}")
    public HabitacionResponse findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HabitacionResponse create(@Valid @RequestBody HabitacionRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public HabitacionResponse update(@PathVariable Long id, @Valid @RequestBody HabitacionRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}

package com.hotel.backend.controller;

import com.hotel.backend.dto.empleado.EmpleadoRequest;
import com.hotel.backend.dto.empleado.EmpleadoResponse;
import com.hotel.backend.service.EmpleadoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/empleados")
@RequiredArgsConstructor
public class EmpleadoController {

    private final EmpleadoService service;

    @GetMapping
    public List<EmpleadoResponse> findAll(@RequestParam(required = false, defaultValue = "false") boolean soloActivos) {
        return soloActivos ? service.findActivos() : service.findAll();
    }

    @GetMapping("/{id}")
    public EmpleadoResponse findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EmpleadoResponse create(@Valid @RequestBody EmpleadoRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public EmpleadoResponse update(@PathVariable Long id, @Valid @RequestBody EmpleadoRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desactivar(@PathVariable Long id) {
        service.desactivar(id);
        return ResponseEntity.noContent().build();
    }
}

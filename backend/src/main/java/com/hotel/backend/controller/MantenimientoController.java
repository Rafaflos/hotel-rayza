package com.hotel.backend.controller;

import com.hotel.backend.dto.mantenimiento.CompletarMantenimientoRequest;
import com.hotel.backend.dto.mantenimiento.MantenimientoRequest;
import com.hotel.backend.dto.mantenimiento.MantenimientoResponse;
import com.hotel.backend.service.MantenimientoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mantenimientos")
@RequiredArgsConstructor
public class MantenimientoController {

    private final MantenimientoService service;

    @GetMapping
    public List<MantenimientoResponse> findAll(@RequestParam(required = false, defaultValue = "false") boolean todas) {
        return todas ? service.findAll() : service.findPendientes();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MantenimientoResponse create(@Valid @RequestBody MantenimientoRequest request) {
        return service.create(request);
    }

    @PostMapping("/{id}/iniciar")
    public MantenimientoResponse iniciar(@PathVariable Long id) {
        return service.iniciar(id);
    }

    @PostMapping("/{id}/completar")
    public MantenimientoResponse completar(@PathVariable Long id, @Valid @RequestBody CompletarMantenimientoRequest request) {
        return service.completar(id, request);
    }

    @PostMapping("/{id}/cancelar")
    public MantenimientoResponse cancelar(@PathVariable Long id) {
        return service.cancelar(id);
    }
}

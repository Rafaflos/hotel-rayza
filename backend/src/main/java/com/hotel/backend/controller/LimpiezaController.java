package com.hotel.backend.controller;

import com.hotel.backend.dto.limpieza.LimpiezaRequest;
import com.hotel.backend.dto.limpieza.LimpiezaResponse;
import com.hotel.backend.dto.limpieza.ObservarRequest;
import com.hotel.backend.service.LimpiezaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/limpiezas")
@RequiredArgsConstructor
public class LimpiezaController {

    private final LimpiezaService service;

    @GetMapping
    public List<LimpiezaResponse> findAll(@RequestParam(required = false, defaultValue = "false") boolean todas) {
        return todas ? service.findAll() : service.findPendientes();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public LimpiezaResponse create(@Valid @RequestBody LimpiezaRequest request) {
        return service.create(request);
    }

    @PostMapping("/{id}/iniciar")
    public LimpiezaResponse iniciar(@PathVariable Long id) {
        return service.iniciar(id);
    }

    @PostMapping("/{id}/completar")
    public LimpiezaResponse completar(@PathVariable Long id) {
        return service.completar(id);
    }

    @PostMapping("/{id}/observar")
    public LimpiezaResponse observar(@PathVariable Long id, @RequestBody(required = false) ObservarRequest request) {
        return service.observar(id, request != null ? request.observaciones() : null);
    }
}

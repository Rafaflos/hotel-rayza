package com.hotel.backend.controller;

import com.hotel.backend.dto.egreso.LiquidarEgresoRequest;
import com.hotel.backend.dto.egreso.SolicitudEgresoRequest;
import com.hotel.backend.dto.egreso.SolicitudEgresoResponse;
import com.hotel.backend.dto.limpieza.ObservarRequest;
import com.hotel.backend.service.SolicitudEgresoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/egresos")
@RequiredArgsConstructor
public class SolicitudEgresoController {

    private final SolicitudEgresoService service;

    @GetMapping
    public List<SolicitudEgresoResponse> findAll(
            @RequestParam(required = false, defaultValue = "false") boolean soloAbiertas,
            @RequestParam(required = false, defaultValue = "false") boolean mias
    ) {
        if (mias) return service.findMias();
        return soloAbiertas ? service.findAbiertas() : service.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SolicitudEgresoResponse solicitar(@Valid @RequestBody SolicitudEgresoRequest request) {
        return service.solicitar(request);
    }

    @PostMapping("/{id}/aprobar")
    @PreAuthorize("hasAnyRole('ADMIN','GERENTE')")
    public SolicitudEgresoResponse aprobar(@PathVariable Long id) {
        return service.aprobar(id);
    }

    @PostMapping("/{id}/rechazar")
    @PreAuthorize("hasAnyRole('ADMIN','GERENTE')")
    public SolicitudEgresoResponse rechazar(@PathVariable Long id,
                                            @RequestBody(required = false) ObservarRequest request) {
        return service.rechazar(id, request != null ? request.observaciones() : null);
    }

    @PostMapping("/{id}/liquidar")
    public SolicitudEgresoResponse liquidar(@PathVariable Long id, @Valid @RequestBody LiquidarEgresoRequest request) {
        return service.liquidar(id, request);
    }
}

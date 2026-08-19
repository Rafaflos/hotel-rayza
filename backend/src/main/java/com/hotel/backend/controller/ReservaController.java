package com.hotel.backend.controller;

import com.hotel.backend.dto.reserva.ReservaRequest;
import com.hotel.backend.dto.reserva.ReservaResponse;
import com.hotel.backend.entity.EstadoReserva;
import com.hotel.backend.service.ReservaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservas")
@RequiredArgsConstructor
public class ReservaController {

    private final ReservaService service;

    @GetMapping
    public List<ReservaResponse> findAll(@RequestParam(required = false) EstadoReserva estado) {
        return estado != null ? service.findByEstado(estado) : service.findAll();
    }

    @GetMapping("/{id}")
    public ReservaResponse findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReservaResponse create(@Valid @RequestBody ReservaRequest request) {
        return service.create(request);
    }

    @PostMapping("/{id}/confirmar")
    public ReservaResponse confirmar(@PathVariable Long id) {
        return service.confirmar(id);
    }

    @PostMapping("/{id}/cancelar")
    public ReservaResponse cancelar(@PathVariable Long id) {
        return service.cancelar(id);
    }
}

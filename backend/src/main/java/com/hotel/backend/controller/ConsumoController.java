package com.hotel.backend.controller;

import com.hotel.backend.dto.consumo.ConsumoRequest;
import com.hotel.backend.dto.consumo.ConsumoResponse;
import com.hotel.backend.service.ConsumoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/consumos")
@RequiredArgsConstructor
public class ConsumoController {

    private final ConsumoService service;

    @GetMapping
    public List<ConsumoResponse> findByReserva(@RequestParam Long reservaId) {
        return service.findByReserva(reservaId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ConsumoResponse create(@Valid @RequestBody ConsumoRequest request) {
        return service.create(request);
    }
}

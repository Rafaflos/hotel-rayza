package com.hotel.backend.controller;

import com.hotel.backend.dto.pago.MetodoPagoResponse;
import com.hotel.backend.dto.pago.PagoRequest;
import com.hotel.backend.dto.pago.PagoResponse;
import com.hotel.backend.service.PagoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pagos")
@RequiredArgsConstructor
public class PagoController {

    private final PagoService service;

    @GetMapping
    public List<PagoResponse> findByReserva(@RequestParam Long reservaId) {
        return service.findByReserva(reservaId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PagoResponse create(@Valid @RequestBody PagoRequest request) {
        return service.create(request);
    }
}

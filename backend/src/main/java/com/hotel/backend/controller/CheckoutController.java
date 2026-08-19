package com.hotel.backend.controller;

import com.hotel.backend.dto.checkout.CheckoutRequest;
import com.hotel.backend.dto.checkout.CheckoutResponse;
import com.hotel.backend.service.CheckoutService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/checkouts")
@RequiredArgsConstructor
public class CheckoutController {

    private final CheckoutService service;

    @GetMapping("/{id}")
    public CheckoutResponse findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @GetMapping("/reserva/{reservaId}")
    public CheckoutResponse findByReserva(@PathVariable Long reservaId) {
        return service.findByReservaId(reservaId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CheckoutResponse create(@Valid @RequestBody CheckoutRequest request) {
        return service.create(request);
    }
}

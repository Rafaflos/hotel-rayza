package com.hotel.backend.controller;

import com.hotel.backend.dto.comprobante.AnularComprobanteRequest;
import com.hotel.backend.dto.comprobante.ComprobanteRequest;
import com.hotel.backend.dto.comprobante.ComprobanteResponse;
import com.hotel.backend.service.ComprobanteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comprobantes")
@RequiredArgsConstructor
public class ComprobanteController {

    private final ComprobanteService service;

    @GetMapping
    public List<ComprobanteResponse> findAll(@RequestParam(required = false) Long checkoutId) {
        return checkoutId != null ? service.findByCheckout(checkoutId) : service.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ComprobanteResponse create(@Valid @RequestBody ComprobanteRequest request) {
        return service.create(request);
    }

    @PostMapping("/{id}/anular")
    public ComprobanteResponse anular(@PathVariable Long id, @Valid @RequestBody AnularComprobanteRequest request) {
        return service.anular(id, request.motivo());
    }
}

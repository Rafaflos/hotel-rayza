package com.hotel.backend.controller;

import com.hotel.backend.dto.pago.MetodoPagoResponse;
import com.hotel.backend.service.PagoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/metodos-pago")
@RequiredArgsConstructor
public class MetodoPagoController {

    private final PagoService pagoService;

    @GetMapping
    public List<MetodoPagoResponse> findAll() {
        return pagoService.findMetodosPago();
    }
}

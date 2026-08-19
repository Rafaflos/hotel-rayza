package com.hotel.backend.controller;

import com.hotel.backend.dto.consumo.ServicioResponse;
import com.hotel.backend.service.ConsumoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/servicios")
@RequiredArgsConstructor
public class ServicioController {

    private final ConsumoService consumoService;

    @GetMapping
    public List<ServicioResponse> findAll() {
        return consumoService.findServicios();
    }
}

package com.hotel.backend.controller;

import com.hotel.backend.dto.estancia.EstanciaResponse;
import com.hotel.backend.service.EstanciaService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/estancias")
@RequiredArgsConstructor
public class EstanciaController {

    private final EstanciaService service;

    @GetMapping
    public List<EstanciaResponse> findAll(@RequestParam(required = false, defaultValue = "false") boolean soloVencidas) {
        return soloVencidas ? service.findVencidas() : service.findActivas();
    }
}

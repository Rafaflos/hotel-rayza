package com.hotel.backend.controller;

import com.hotel.backend.dto.hospedado.HospedadoResponse;
import com.hotel.backend.service.HospedadoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/hospedados")
@RequiredArgsConstructor
public class HospedadoController {

    private final HospedadoService service;

    @GetMapping
    public List<HospedadoResponse> findAll(@RequestParam(required = false, defaultValue = "false") boolean soloVencidas) {
        return soloVencidas ? service.findVencidas() : service.findActivas();
    }
}

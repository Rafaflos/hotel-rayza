package com.hotel.backend.controller;

import com.hotel.backend.dto.caja.AbrirCajaRequest;
import com.hotel.backend.dto.caja.CajaResponse;
import com.hotel.backend.dto.caja.CerrarCajaRequest;
import com.hotel.backend.dto.caja.MovimientoCajaResponse;
import com.hotel.backend.service.CajaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cajas")
@RequiredArgsConstructor
public class CajaController {

    private final CajaService service;

    @GetMapping
    public List<CajaResponse> findAll() {
        return service.findAll();
    }

    @GetMapping("/abierta")
    public CajaResponse findAbierta() {
        return service.findAbierta();
    }

    @GetMapping("/{id}/movimientos")
    public List<MovimientoCajaResponse> movimientos(@PathVariable Long id) {
        return service.findMovimientos(id);
    }

    @PostMapping("/abrir")
    @ResponseStatus(HttpStatus.CREATED)
    public CajaResponse abrir(@Valid @RequestBody AbrirCajaRequest request) {
        return service.abrir(request);
    }

    @PostMapping("/{id}/cerrar")
    public CajaResponse cerrar(@PathVariable Long id, @Valid @RequestBody CerrarCajaRequest request) {
        return service.cerrar(id, request);
    }
}

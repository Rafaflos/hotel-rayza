package com.hotel.backend.controller;

import com.hotel.backend.dto.aviso.AvisoRequest;
import com.hotel.backend.dto.aviso.AvisoResponse;
import com.hotel.backend.entity.CategoriaAviso;
import com.hotel.backend.service.AvisoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/avisos")
@RequiredArgsConstructor
public class AvisoController {

    private final AvisoService service;

    @GetMapping
    public List<AvisoResponse> findAll(
            @RequestParam(required = false) CategoriaAviso categoria,
            @RequestParam(required = false, defaultValue = "false") boolean soloPendientes
    ) {
        return service.findAll(categoria, soloPendientes);
    }

    @GetMapping("/no-leidos")
    public Map<String, Long> contarNoLeidos() {
        return Map.of("noLeidos", service.contarNoLeidos());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AvisoResponse create(@Valid @RequestBody AvisoRequest request) {
        return service.create(request);
    }

    @PostMapping("/{id}/leido")
    public ResponseEntity<Void> marcarLeido(@PathVariable Long id) {
        service.marcarLeido(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/resolver")
    public AvisoResponse resolver(@PathVariable Long id) {
        return service.resolver(id);
    }
}

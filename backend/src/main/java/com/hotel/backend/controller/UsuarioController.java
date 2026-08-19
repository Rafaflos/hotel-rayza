package com.hotel.backend.controller;

import com.hotel.backend.dto.usuario.RolResponse;
import com.hotel.backend.dto.usuario.UsuarioRequest;
import com.hotel.backend.dto.usuario.UsuarioResponse;
import com.hotel.backend.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class UsuarioController {

    private final UsuarioService service;

    @GetMapping
    public List<UsuarioResponse> findAll() {
        return service.findAll();
    }

    @GetMapping("/roles")
    public List<RolResponse> findRoles() {
        return service.findRoles();
    }

    @GetMapping("/{id}")
    public UsuarioResponse findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UsuarioResponse create(@Valid @RequestBody UsuarioRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public UsuarioResponse update(@PathVariable Long id, @Valid @RequestBody UsuarioRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desactivar(@PathVariable Long id) {
        service.desactivar(id);
        return ResponseEntity.noContent().build();
    }
}

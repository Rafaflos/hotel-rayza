package com.hotel.backend.controller;

import com.hotel.backend.dto.huesped.HuespedRequest;
import com.hotel.backend.dto.huesped.HuespedResponse;
import com.hotel.backend.service.HuespedService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/huespedes")
@RequiredArgsConstructor
public class HuespedController {

    private final HuespedService service;

    @GetMapping
    public List<HuespedResponse> findAll(@RequestParam(required = false) String q) {
        return (q == null || q.isBlank()) ? service.findAll() : service.search(q);
    }

    @GetMapping("/{id}")
    public HuespedResponse findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HuespedResponse create(@Valid @RequestBody HuespedRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public HuespedResponse update(@PathVariable Long id, @Valid @RequestBody HuespedRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}

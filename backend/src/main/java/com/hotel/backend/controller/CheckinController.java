package com.hotel.backend.controller;

import com.hotel.backend.dto.checkin.CheckinRequest;
import com.hotel.backend.dto.checkin.CheckinResponse;
import com.hotel.backend.service.CheckinService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/checkins")
@RequiredArgsConstructor
public class CheckinController {

    private final CheckinService service;

    @GetMapping("/{id}")
    public CheckinResponse findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @GetMapping("/reserva/{reservaId}")
    public CheckinResponse findByReserva(@PathVariable Long reservaId) {
        return service.findByReservaId(reservaId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CheckinResponse create(@Valid @RequestBody CheckinRequest request) {
        return service.create(request);
    }
}

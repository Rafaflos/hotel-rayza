package com.hotel.backend.controller;

import com.hotel.backend.dto.dashboard.DashboardResponse;
import com.hotel.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService service;

    @GetMapping("/resumen")
    public DashboardResponse resumen() {
        return service.resumen();
    }
}

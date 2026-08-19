package com.hotel.backend.controller;

import com.hotel.backend.dto.reporte.ReporteResumenResponse;
import com.hotel.backend.service.ReporteExportService;
import com.hotel.backend.service.ReporteService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/reportes")
@RequiredArgsConstructor
public class ReporteController {

    private final ReporteService service;
    private final ReporteExportService exportService;

    @GetMapping("/resumen")
    public ReporteResumenResponse resumen(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta
    ) {
        return service.resumen(desde, hasta);
    }

    @GetMapping("/reservas.csv")
    public ResponseEntity<byte[]> reservasCsv(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta
    ) {
        byte[] body = service.reservasCsv(desde, hasta).getBytes(StandardCharsets.UTF_8);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("text/csv"))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment().filename("reservas_" + desde + "_" + hasta + ".csv").build().toString())
                .body(body);
    }

    @GetMapping("/reservas.xlsx")
    public ResponseEntity<byte[]> reservasXlsx(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta
    ) {
        byte[] body = exportService.reservasXlsx(desde, hasta);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment().filename("reservas_" + desde + "_" + hasta + ".xlsx").build().toString())
                .body(body);
    }

    @GetMapping("/resumen.pdf")
    public ResponseEntity<byte[]> resumenPdf(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta
    ) {
        byte[] body = exportService.resumenPdf(desde, hasta);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment().filename("resumen_" + desde + "_" + hasta + ".pdf").build().toString())
                .body(body);
    }
}

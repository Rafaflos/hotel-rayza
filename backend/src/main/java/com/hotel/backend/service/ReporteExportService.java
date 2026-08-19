package com.hotel.backend.service;

import com.hotel.backend.service.export.ExcelGenerator;
import com.hotel.backend.service.export.PdfGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class ReporteExportService {

    private final ExcelGenerator excelGenerator;
    private final PdfGenerator pdfGenerator;

    public byte[] reservasXlsx(LocalDate desde, LocalDate hasta) {
        return excelGenerator.reservasXlsx(desde, hasta);
    }

    public byte[] resumenPdf(LocalDate desde, LocalDate hasta) {
        return pdfGenerator.resumenPdf(desde, hasta);
    }
}

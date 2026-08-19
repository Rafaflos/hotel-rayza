package com.hotel.backend.service.export;

import com.hotel.backend.dto.reporte.ReporteResumenResponse;
import com.hotel.backend.service.ReporteService;
import com.lowagie.text.Chunk;
import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class PdfGenerator {

    private static final DateTimeFormatter FECHA = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    private final ReporteService reporteService;

    public byte[] resumenPdf(LocalDate desde, LocalDate hasta) {
        ReporteResumenResponse r = reporteService.resumen(desde, hasta);

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document doc = new Document(PageSize.A4, 40, 40, 50, 40);
            PdfWriter.getInstance(doc, out);
            doc.open();

            Font titleFont = new Font(Font.HELVETICA, 18, Font.BOLD);
            Font subFont = new Font(Font.HELVETICA, 10, Font.NORMAL, Color.GRAY);
            Font sectionFont = new Font(Font.HELVETICA, 12, Font.BOLD);

            doc.add(new Paragraph("Hotel Rayza — Reporte", titleFont));
            doc.add(new Paragraph("Periodo: " + desde.format(FECHA) + " al " + hasta.format(FECHA), subFont));
            doc.add(new Paragraph("Generado: " + LocalDate.now().format(FECHA), subFont));
            doc.add(Chunk.NEWLINE);

            doc.add(new Paragraph("Resumen general", sectionFont));
            doc.add(Chunk.NEWLINE);
            PdfPTable general = new PdfPTable(2);
            general.setWidthPercentage(100);
            fila(general, "Habitaciones totales", String.valueOf(r.totalHabitaciones()));
            fila(general, "Ocupadas ahora", String.valueOf(r.habitacionesOcupadasActual()));
            fila(general, "Reservas en el periodo", String.valueOf(r.totalReservas()));
            fila(general, "Cancelaciones", String.valueOf(r.cancelaciones()));
            fila(general, "Check-in", String.valueOf(r.checkins()));
            fila(general, "Check-out", String.valueOf(r.checkouts()));
            fila(general, "Ingresos totales", "S/ " + r.ingresosTotal().setScale(2, RoundingMode.HALF_UP));
            doc.add(general);
            doc.add(Chunk.NEWLINE);

            if (!r.ingresosPorMetodo().isEmpty()) {
                doc.add(new Paragraph("Ingresos por método de pago", sectionFont));
                doc.add(Chunk.NEWLINE);
                PdfPTable metodos = new PdfPTable(2);
                metodos.setWidthPercentage(100);
                for (Map.Entry<String, BigDecimal> e : r.ingresosPorMetodo().entrySet()) {
                    fila(metodos, e.getKey(), "S/ " + e.getValue().setScale(2, RoundingMode.HALF_UP));
                }
                doc.add(metodos);
                doc.add(Chunk.NEWLINE);
            }

            if (!r.reservasPorEstado().isEmpty()) {
                doc.add(new Paragraph("Reservas por estado", sectionFont));
                doc.add(Chunk.NEWLINE);
                PdfPTable estados = new PdfPTable(2);
                estados.setWidthPercentage(100);
                for (Map.Entry<String, Long> e : r.reservasPorEstado().entrySet()) {
                    fila(estados, e.getKey(), String.valueOf(e.getValue()));
                }
                doc.add(estados);
            }

            doc.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("No se pudo generar el PDF: " + e.getMessage(), e);
        }
    }

    private void fila(PdfPTable table, String etiqueta, String valor) {
        PdfPCell c1 = new PdfPCell(new Phrase(etiqueta, new Font(Font.HELVETICA, 10)));
        PdfPCell c2 = new PdfPCell(new Phrase(valor, new Font(Font.HELVETICA, 10, Font.BOLD)));
        c1.setPadding(6);
        c2.setPadding(6);
        c2.setHorizontalAlignment(Element.ALIGN_RIGHT);
        table.addCell(c1);
        table.addCell(c2);
    }
}

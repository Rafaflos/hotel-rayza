package com.hotel.backend.service.export;

import com.hotel.backend.entity.Reserva;
import com.hotel.backend.repository.ReservaRepository;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ExcelGenerator {

    private static final DateTimeFormatter FECHA = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    private final ReservaRepository reservaRepository;

    @Transactional(readOnly = true)
    public byte[] reservasXlsx(LocalDate desde, LocalDate hasta) {
        try (Workbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = wb.createSheet("Reservas");

            CellStyle header = wb.createCellStyle();
            Font headerFont = wb.createFont();
            headerFont.setBold(true);
            header.setFont(headerFont);
            header.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            header.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            String[] cols = {"Código", "Huésped", "Habitación", "Entrada", "Salida", "Noches", "Total (S/)", "Estado"};
            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < cols.length; i++) {
                Cell c = headerRow.createCell(i);
                c.setCellValue(cols[i]);
                c.setCellStyle(header);
            }

            List<Reserva> reservas = reservaRepository.findByFechaEntradaBetween(desde, hasta);
            int rowIdx = 1;
            for (Reserva r : reservas) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(r.getCodigo());
                row.createCell(1).setCellValue(r.getHuespedPrincipal().getNombres() + " " + r.getHuespedPrincipal().getApellidos());
                row.createCell(2).setCellValue(r.getHabitacion().getNumero());
                row.createCell(3).setCellValue(r.getFechaEntrada().format(FECHA));
                row.createCell(4).setCellValue(r.getFechaSalida().format(FECHA));
                row.createCell(5).setCellValue(r.getCantidadNoches());
                row.createCell(6).setCellValue(r.getTotal().doubleValue());
                row.createCell(7).setCellValue(r.getEstado().name());
            }

            for (int i = 0; i < cols.length; i++) {
                sheet.autoSizeColumn(i);
            }

            wb.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("No se pudo generar el Excel: " + e.getMessage(), e);
        }
    }
}

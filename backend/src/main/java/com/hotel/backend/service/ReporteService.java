package com.hotel.backend.service;

import com.hotel.backend.dto.caja.CajaResponse;
import com.hotel.backend.dto.reporte.ReporteResumenResponse;
import com.hotel.backend.entity.*;
import com.hotel.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReporteService {

    private final HabitacionRepository habitacionRepository;
    private final ReservaRepository reservaRepository;
    private final CheckinRepository checkinRepository;
    private final CheckoutRepository checkoutRepository;
    private final PagoRepository pagoRepository;
    private final CajaRepository cajaRepository;

    public ReporteResumenResponse resumen(LocalDate desde, LocalDate hasta) {
        LocalDateTime inicio = LocalDateTime.of(desde, LocalTime.MIN);
        LocalDateTime fin = LocalDateTime.of(hasta, LocalTime.MAX);

        List<Reserva> reservas = reservaRepository.findByFechaEntradaBetween(desde, hasta);

        Map<String, Long> reservasPorEstado = reservas.stream()
                .collect(Collectors.groupingBy(r -> r.getEstado().name(), Collectors.counting()));

        long cancelaciones = reservas.stream()
                .filter(r -> r.getEstado() == EstadoReserva.CANCELADA || r.getEstado() == EstadoReserva.NO_SHOW)
                .count();

        List<Pago> pagos = pagoRepository.findByFechaHoraBetween(inicio, fin).stream()
                .filter(p -> p.getEstado() == EstadoPago.CONFIRMADO)
                .toList();

        BigDecimal ingresosTotal = pagos.stream().map(Pago::getMonto).reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, BigDecimal> ingresosPorMetodo = pagos.stream()
                .collect(Collectors.groupingBy(
                        p -> p.getMetodoPago().getNombre(),
                        Collectors.reducing(BigDecimal.ZERO, Pago::getMonto, BigDecimal::add)
                ));

        List<CajaResponse> cajas = cajaRepository.findByFechaBetween(desde, hasta).stream()
                .map(this::toCajaResponse)
                .toList();

        return new ReporteResumenResponse(
                desde,
                hasta,
                habitacionRepository.count(),
                habitacionRepository.countByEstado(EstadoHabitacion.OCUPADA),
                reservas.size(),
                reservasPorEstado,
                cancelaciones,
                checkinRepository.countByFechaHoraBetween(inicio, fin),
                checkoutRepository.countByFechaHoraBetween(inicio, fin),
                ingresosTotal,
                ingresosPorMetodo,
                cajas
        );
    }

    public String reservasCsv(LocalDate desde, LocalDate hasta) {
        StringBuilder sb = new StringBuilder("codigo,huesped,habitacion,fecha_entrada,fecha_salida,noches,total,estado\n");
        for (Reserva r : reservaRepository.findByFechaEntradaBetween(desde, hasta)) {
            sb.append(csv(r.getCodigo())).append(',')
                    .append(csv(r.getHuespedPrincipal().getNombres() + " " + r.getHuespedPrincipal().getApellidos())).append(',')
                    .append(csv(r.getHabitacion().getNumero())).append(',')
                    .append(r.getFechaEntrada()).append(',')
                    .append(r.getFechaSalida()).append(',')
                    .append(r.getCantidadNoches()).append(',')
                    .append(r.getTotal()).append(',')
                    .append(r.getEstado())
                    .append('\n');
        }
        return sb.toString();
    }

    private String csv(String value) {
        if (value == null) return "";
        String escaped = value.replace("\"", "\"\"");
        return escaped.contains(",") ? "\"" + escaped + "\"" : escaped;
    }

    private CajaResponse toCajaResponse(Caja caja) {
        return new CajaResponse(
                caja.getId(),
                caja.getFecha(),
                caja.getUsuarioApertura() != null ? caja.getUsuarioApertura().getUsername() : null,
                caja.getUsuarioCierre() != null ? caja.getUsuarioCierre().getUsername() : null,
                caja.getMontoInicial(),
                caja.getMontoFinal(),
                caja.getTotalIngresos(),
                caja.getTotalEgresos(),
                caja.getDiferencia(),
                caja.getEstado(),
                caja.getFechaApertura(),
                caja.getFechaCierre(),
                caja.getObservaciones()
        );
    }
}

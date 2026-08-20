package com.hotel.backend.service;

import com.hotel.backend.dto.dashboard.DashboardResponse;
import com.hotel.backend.dto.estancia.EstanciaResponse;
import com.hotel.backend.entity.EstadoHabitacion;
import com.hotel.backend.entity.EstadoSolicitudEgreso;
import com.hotel.backend.repository.CheckinRepository;
import com.hotel.backend.repository.CheckoutRepository;
import com.hotel.backend.repository.HabitacionRepository;
import com.hotel.backend.repository.PagoRepository;
import com.hotel.backend.repository.ReservaRepository;
import com.hotel.backend.repository.SolicitudEgresoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final HabitacionRepository habitacionRepository;
    private final ReservaRepository reservaRepository;
    private final CheckinRepository checkinRepository;
    private final CheckoutRepository checkoutRepository;
    private final PagoRepository pagoRepository;
    private final SolicitudEgresoRepository solicitudEgresoRepository;
    private final EstanciaService estanciaService;
    private final AvisoService avisoService;

    public DashboardResponse resumen() {
        LocalDate hoy = LocalDate.now();
        LocalDateTime inicioDia = LocalDateTime.of(hoy, LocalTime.MIN);
        LocalDateTime finDia = LocalDateTime.of(hoy, LocalTime.MAX);

        long disponibles = habitacionRepository.countByEstado(EstadoHabitacion.DISPONIBLE);
        long ocupadas = habitacionRepository.countByEstado(EstadoHabitacion.OCUPADA);
        long total = habitacionRepository.count();
        int tasaOcupacion = total > 0 ? (int) Math.round((ocupadas * 100.0) / total) : 0;

        List<EstanciaResponse> vencidas = estanciaService.findVencidas();
        BigDecimal porCobrarVencidas = vencidas.stream()
                .map(EstanciaResponse::saldoPendiente)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new DashboardResponse(
                disponibles,
                ocupadas,
                habitacionRepository.countByEstado(EstadoHabitacion.RESERVADA),
                habitacionRepository.countByEstado(EstadoHabitacion.LIMPIEZA),
                habitacionRepository.countByEstado(EstadoHabitacion.MANTENIMIENTO),
                reservaRepository.countByFechaEntrada(hoy),
                checkinRepository.countByFechaHoraBetween(inicioDia, finDia),
                checkoutRepository.countByFechaHoraBetween(inicioDia, finDia),
                pagoRepository.sumConfirmadosBetween(inicioDia, finDia),
                tasaOcupacion,
                vencidas.size(),
                porCobrarVencidas,
                solicitudEgresoRepository.countByEstado(EstadoSolicitudEgreso.PENDIENTE),
                avisoService.contarNoLeidos()
        );
    }
}

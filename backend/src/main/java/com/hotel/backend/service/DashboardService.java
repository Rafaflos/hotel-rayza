package com.hotel.backend.service;

import com.hotel.backend.dto.dashboard.DashboardResponse;
import com.hotel.backend.entity.EstadoHabitacion;
import com.hotel.backend.repository.CheckinRepository;
import com.hotel.backend.repository.CheckoutRepository;
import com.hotel.backend.repository.HabitacionRepository;
import com.hotel.backend.repository.PagoRepository;
import com.hotel.backend.repository.ReservaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final HabitacionRepository habitacionRepository;
    private final ReservaRepository reservaRepository;
    private final CheckinRepository checkinRepository;
    private final CheckoutRepository checkoutRepository;
    private final PagoRepository pagoRepository;

    public DashboardResponse resumen() {
        LocalDate hoy = LocalDate.now();
        LocalDateTime inicioDia = LocalDateTime.of(hoy, LocalTime.MIN);
        LocalDateTime finDia = LocalDateTime.of(hoy, LocalTime.MAX);

        return new DashboardResponse(
                habitacionRepository.countByEstado(EstadoHabitacion.DISPONIBLE),
                habitacionRepository.countByEstado(EstadoHabitacion.OCUPADA),
                habitacionRepository.countByEstado(EstadoHabitacion.RESERVADA),
                habitacionRepository.countByEstado(EstadoHabitacion.LIMPIEZA),
                habitacionRepository.countByEstado(EstadoHabitacion.MANTENIMIENTO),
                reservaRepository.countByFechaEntrada(hoy),
                checkinRepository.countByFechaHoraBetween(inicioDia, finDia),
                checkoutRepository.countByFechaHoraBetween(inicioDia, finDia),
                pagoRepository.sumConfirmadosBetween(inicioDia, finDia)
        );
    }
}

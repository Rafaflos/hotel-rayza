package com.hotel.backend.service;

import com.hotel.backend.dto.hospedado.HospedadoResponse;
import com.hotel.backend.entity.EstadoReserva;
import com.hotel.backend.entity.Reserva;
import com.hotel.backend.repository.ConsumoRepository;
import com.hotel.backend.repository.PagoRepository;
import com.hotel.backend.repository.ReservaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

/**
 * Estancias en curso (reservas con check-in hecho). Calcula lo que debe cada
 * huésped y detecta a los que ya pasaron su hora límite de salida.
 *
 * Regla del hotel: pasada la hora límite del día de salida se cobra un día
 * completo adicional por cada día iniciado, a la tarifa de la habitación.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class HospedadoService {

    private final ReservaRepository reservaRepository;
    private final PagoRepository pagoRepository;
    private final ConsumoRepository consumoRepository;

    public List<HospedadoResponse> findActivas() {
        return reservaRepository.findByEstado(EstadoReserva.CHECK_IN).stream()
                .map(this::toResponse)
                .toList();
    }

    /** Solo las que ya se pasaron de la hora límite (para la alerta del dashboard). */
    public List<HospedadoResponse> findVencidas() {
        return findActivas().stream().filter(HospedadoResponse::vencida).toList();
    }

    /**
     * Días completos que el huésped se ha pasado. 0 si aún está dentro de su
     * horario. Se cuenta un día por cada día iniciado después de la hora límite.
     */
    public int calcularDiasExtra(Reserva reserva, LocalDateTime ahora) {
        LocalDateTime limite = LocalDateTime.of(reserva.getFechaSalida(), reserva.getHoraLimiteSalida());
        if (!ahora.isAfter(limite)) {
            return 0;
        }
        // Un día extra apenas se pasa del límite; otro por cada 24 h adicionales.
        long horas = ChronoUnit.HOURS.between(limite, ahora);
        return (int) (horas / 24) + 1;
    }

    public BigDecimal calcularCargoExtra(Reserva reserva, int diasExtra) {
        return reserva.getPrecioNoche().multiply(BigDecimal.valueOf(diasExtra));
    }

    private HospedadoResponse toResponse(Reserva reserva) {
        LocalDateTime ahora = LocalDateTime.now();
        int diasExtra = calcularDiasExtra(reserva, ahora);
        BigDecimal cargoExtra = calcularCargoExtra(reserva, diasExtra);

        BigDecimal totalHospedaje = reserva.getTotal().add(cargoExtra);
        BigDecimal totalConsumos = consumoRepository.sumByReserva(reserva.getId());
        BigDecimal totalCuenta = totalHospedaje.add(totalConsumos);
        BigDecimal totalPagado = pagoRepository.sumConfirmadosByReserva(reserva.getId());
        BigDecimal saldo = totalCuenta.subtract(totalPagado).max(BigDecimal.ZERO);

        int diasTranscurridos = (int) ChronoUnit.DAYS.between(reserva.getFechaEntrada(), LocalDate.now());
        if (diasTranscurridos < 1) {
            diasTranscurridos = 1;
        }

        boolean vencida = diasExtra > 0;
        String estadoOperativo = vencida
                ? "VENCIDA"
                : (saldo.compareTo(BigDecimal.ZERO) > 0 ? "POR COBRAR" : "AL DIA");

        return new HospedadoResponse(
                reserva.getId(),
                reserva.getCodigo(),
                reserva.getHabitacion().getNumero(),
                reserva.getHuespedPrincipal().getNombres() + " " + reserva.getHuespedPrincipal().getApellidos(),
                reserva.getHuespedPrincipal().getNumeroDocumento(),
                reserva.getFechaEntrada(),
                reserva.getFechaSalida(),
                reserva.getHoraLimiteSalida(),
                diasTranscurridos,
                diasExtra,
                cargoExtra,
                totalHospedaje,
                totalConsumos,
                totalCuenta,
                totalPagado,
                saldo,
                vencida,
                estadoOperativo
        );
    }
}

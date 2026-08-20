package com.hotel.backend.service;

import com.hotel.backend.dto.checkout.CheckoutRequest;
import com.hotel.backend.dto.checkout.CheckoutResponse;
import com.hotel.backend.entity.Checkout;
import com.hotel.backend.entity.EstadoHabitacion;
import com.hotel.backend.entity.EstadoLimpieza;
import com.hotel.backend.entity.EstadoReserva;
import com.hotel.backend.entity.Habitacion;
import com.hotel.backend.entity.Limpieza;
import com.hotel.backend.entity.Reserva;
import com.hotel.backend.exception.BusinessException;
import com.hotel.backend.exception.ResourceNotFoundException;
import com.hotel.backend.mapper.HabitacionMapper;
import com.hotel.backend.mapper.HuespedMapper;
import com.hotel.backend.repository.CheckoutRepository;
import com.hotel.backend.repository.ConsumoRepository;
import com.hotel.backend.repository.HabitacionRepository;
import com.hotel.backend.repository.LimpiezaRepository;
import com.hotel.backend.repository.ReservaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CheckoutService {

    private final CheckoutRepository repository;
    private final ReservaRepository reservaRepository;
    private final HabitacionRepository habitacionRepository;
    private final ConsumoRepository consumoRepository;
    private final LimpiezaRepository limpiezaRepository;
    private final HospedadoService hospedadoService;
    private final CurrentUserService currentUserService;
    private final HuespedMapper huespedMapper;
    private final HabitacionMapper habitacionMapper;

    public CheckoutResponse findById(Long id) {
        return toResponse(getEntity(id));
    }

    public CheckoutResponse findByReservaId(Long reservaId) {
        return toResponse(repository.findByReservaId(reservaId)
                .orElseThrow(() -> new ResourceNotFoundException("No hay check-out para la reserva: " + reservaId)));
    }

    @Transactional
    public CheckoutResponse create(CheckoutRequest request) {
        Reserva reserva = reservaRepository.findById(request.reservaId())
                .orElseThrow(() -> new ResourceNotFoundException("Reserva no encontrada: " + request.reservaId()));

        if (reserva.getEstado() != EstadoReserva.CHECK_IN) {
            throw new BusinessException("Solo una reserva con CHECK_IN puede pasar a check-out");
        }

        if (repository.findByReservaId(reserva.getId()).isPresent()) {
            throw new BusinessException("Esta reserva ya tiene un check-out registrado");
        }

        // Si el huésped se pasó de su hora límite, se le cobran los días extra
        // a la tarifa de la habitación y quedan registrados en la reserva.
        int diasExtra = hospedadoService.calcularDiasExtra(reserva, java.time.LocalDateTime.now());
        BigDecimal cargoExtra = hospedadoService.calcularCargoExtra(reserva, diasExtra);
        if (diasExtra > 0) {
            reserva.setDiasExtra(diasExtra);
            reserva.setCargoExtra(cargoExtra);
        }

        BigDecimal descuento = request.descuento() != null ? request.descuento() : BigDecimal.ZERO;
        BigDecimal subtotalHospedaje = reserva.getTotal().add(cargoExtra);
        BigDecimal subtotalConsumos = consumoRepository.sumByReserva(reserva.getId());
        BigDecimal subtotalServicios = BigDecimal.ZERO;
        BigDecimal total = subtotalHospedaje.add(subtotalConsumos).add(subtotalServicios).subtract(descuento).max(BigDecimal.ZERO);

        Habitacion habitacion = reserva.getHabitacion();

        Checkout checkout = Checkout.builder()
                .reserva(reserva)
                .huesped(reserva.getHuespedPrincipal())
                .habitacion(habitacion)
                .subtotalHospedaje(subtotalHospedaje)
                .subtotalConsumos(subtotalConsumos)
                .subtotalServicios(subtotalServicios)
                .descuento(descuento)
                .total(total)
                .observaciones(request.observaciones())
                .usuario(currentUserService.getUsuario())
                .build();

        Checkout saved = repository.save(checkout);

        reserva.setEstado(EstadoReserva.CHECK_OUT);
        reserva.setUpdatedBy(currentUserService.getUsuario());
        reservaRepository.save(reserva);

        habitacion.setEstado(EstadoHabitacion.LIMPIEZA);
        habitacionRepository.save(habitacion);

        Limpieza limpieza = Limpieza.builder()
                .habitacion(habitacion)
                .estado(EstadoLimpieza.PENDIENTE)
                .observaciones("Generada automáticamente tras check-out de " + reserva.getCodigo())
                .build();
        limpiezaRepository.save(limpieza);

        return toResponse(saved);
    }

    private CheckoutResponse toResponse(Checkout checkout) {
        return new CheckoutResponse(
                checkout.getId(),
                checkout.getReserva().getId(),
                checkout.getReserva().getCodigo(),
                huespedMapper.toResponse(checkout.getHuesped()),
                habitacionMapper.toResponse(checkout.getHabitacion()),
                checkout.getFechaHora(),
                checkout.getSubtotalHospedaje(),
                checkout.getSubtotalConsumos(),
                checkout.getSubtotalServicios(),
                checkout.getDescuento(),
                checkout.getTotal(),
                checkout.getObservaciones()
        );
    }

    private Checkout getEntity(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Check-out no encontrado: " + id));
    }
}

package com.hotel.backend.service;

import com.hotel.backend.dto.reserva.ReservaRequest;
import com.hotel.backend.dto.reserva.ReservaResponse;
import com.hotel.backend.entity.*;
import com.hotel.backend.exception.BusinessException;
import com.hotel.backend.exception.ResourceNotFoundException;
import com.hotel.backend.mapper.ReservaMapper;
import com.hotel.backend.repository.HabitacionRepository;
import com.hotel.backend.repository.HuespedRepository;
import com.hotel.backend.repository.ReservaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReservaService {

    private final ReservaRepository repository;
    private final HuespedRepository huespedRepository;
    private final HabitacionRepository habitacionRepository;
    private final CurrentUserService currentUserService;
    private final ReservaMapper mapper;

    public List<ReservaResponse> findAll() {
        return repository.findAll().stream().map(mapper::toResponse).toList();
    }

    public List<ReservaResponse> findByEstado(EstadoReserva estado) {
        return repository.findByEstado(estado).stream().map(mapper::toResponse).toList();
    }

    public ReservaResponse findById(Long id) {
        return mapper.toResponse(getEntity(id));
    }

    @Transactional
    public ReservaResponse create(ReservaRequest request) {
        validarFechas(request.fechaEntrada(), request.fechaSalida());

        Huesped huesped = huespedRepository.findById(request.huespedPrincipalId())
                .orElseThrow(() -> new ResourceNotFoundException("Huésped no encontrado: " + request.huespedPrincipalId()));

        Habitacion habitacion = habitacionRepository.findById(request.habitacionId())
                .orElseThrow(() -> new ResourceNotFoundException("Habitación no encontrada: " + request.habitacionId()));

        if (request.cantidadHuespedes() > habitacion.getCapacidad()) {
            throw new BusinessException(
                    "La habitación " + habitacion.getNumero() + " tiene capacidad para " + habitacion.getCapacidad() + " huéspedes");
        }

        verificarDisponibilidad(habitacion.getId(), request.fechaEntrada(), request.fechaSalida(), null);

        long noches = ChronoUnit.DAYS.between(request.fechaEntrada(), request.fechaSalida());
        BigDecimal descuento = request.descuento() != null ? request.descuento() : BigDecimal.ZERO;
        BigDecimal subtotal = habitacion.getPrecioNoche().multiply(BigDecimal.valueOf(noches));
        BigDecimal total = subtotal.subtract(descuento).max(BigDecimal.ZERO);

        Reserva reserva = Reserva.builder()
                .codigo(generarCodigo())
                .huespedPrincipal(huesped)
                .habitacion(habitacion)
                .fechaEntrada(request.fechaEntrada())
                .fechaSalida(request.fechaSalida())
                .cantidadHuespedes(request.cantidadHuespedes())
                .precioNoche(habitacion.getPrecioNoche())
                .cantidadNoches((int) noches)
                .descuento(descuento)
                .subtotal(subtotal)
                .total(total)
                .estado(EstadoReserva.PENDIENTE)
                .observaciones(request.observaciones())
                .createdBy(currentUserService.getUsuario())
                .build();

        Reserva saved = repository.save(reserva);

        if (habitacion.getEstado() == EstadoHabitacion.DISPONIBLE) {
            habitacion.setEstado(EstadoHabitacion.RESERVADA);
            habitacionRepository.save(habitacion);
        }

        return mapper.toResponse(saved);
    }

    @Transactional
    public ReservaResponse confirmar(Long id) {
        Reserva reserva = getEntity(id);
        if (reserva.getEstado() != EstadoReserva.PENDIENTE) {
            throw new BusinessException("Solo una reserva PENDIENTE puede confirmarse");
        }
        reserva.setEstado(EstadoReserva.CONFIRMADA);
        reserva.setUpdatedBy(currentUserService.getUsuario());
        return mapper.toResponse(repository.save(reserva));
    }

    @Transactional
    public ReservaResponse cancelar(Long id) {
        Reserva reserva = getEntity(id);
        if (reserva.getEstado() == EstadoReserva.CHECK_IN || reserva.getEstado() == EstadoReserva.CHECK_OUT) {
            throw new BusinessException("No se puede cancelar una reserva con check-in registrado");
        }
        reserva.setEstado(EstadoReserva.CANCELADA);
        reserva.setUpdatedBy(currentUserService.getUsuario());
        Reserva saved = repository.save(reserva);

        // Solo libera la habitación si ninguna otra reserva activa la cubre hoy
        Habitacion habitacion = reserva.getHabitacion();
        if (habitacion.getEstado() == EstadoHabitacion.RESERVADA
                && repository.findConflictos(habitacion.getId(), LocalDate.now(), LocalDate.now().plusDays(1), saved.getId()).isEmpty()) {
            habitacion.setEstado(EstadoHabitacion.DISPONIBLE);
            habitacionRepository.save(habitacion);
        }

        return mapper.toResponse(saved);
    }

    private void verificarDisponibilidad(Long habitacionId, LocalDate entrada, LocalDate salida, Long excludeReservaId) {
        List<Reserva> conflictos = repository.findConflictos(habitacionId, entrada, salida, excludeReservaId);
        if (!conflictos.isEmpty()) {
            throw new BusinessException("La habitación no está disponible entre " + entrada + " y " + salida);
        }
    }

    private void validarFechas(LocalDate entrada, LocalDate salida) {
        if (!salida.isAfter(entrada)) {
            throw new BusinessException("La fecha de salida debe ser posterior a la fecha de entrada");
        }
    }

    private String generarCodigo() {
        String prefix = "RES-" + LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE) + "-";
        String codigo;
        do {
            codigo = prefix + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        } while (repository.findByCodigo(codigo).isPresent());
        return codigo;
    }

    private Reserva getEntity(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva no encontrada: " + id));
    }
}

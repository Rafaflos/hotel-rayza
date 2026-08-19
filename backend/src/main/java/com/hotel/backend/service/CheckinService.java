package com.hotel.backend.service;

import com.hotel.backend.dto.checkin.CheckinRequest;
import com.hotel.backend.dto.checkin.CheckinResponse;
import com.hotel.backend.entity.Checkin;
import com.hotel.backend.entity.EstadoHabitacion;
import com.hotel.backend.entity.EstadoReserva;
import com.hotel.backend.entity.Habitacion;
import com.hotel.backend.entity.Reserva;
import com.hotel.backend.exception.BusinessException;
import com.hotel.backend.exception.ResourceNotFoundException;
import com.hotel.backend.mapper.HabitacionMapper;
import com.hotel.backend.mapper.HuespedMapper;
import com.hotel.backend.repository.CheckinRepository;
import com.hotel.backend.repository.HabitacionRepository;
import com.hotel.backend.repository.ReservaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CheckinService {

    private final CheckinRepository repository;
    private final ReservaRepository reservaRepository;
    private final HabitacionRepository habitacionRepository;
    private final CurrentUserService currentUserService;
    private final HuespedMapper huespedMapper;
    private final HabitacionMapper habitacionMapper;

    public CheckinResponse findById(Long id) {
        return toResponse(getEntity(id));
    }

    public CheckinResponse findByReservaId(Long reservaId) {
        return toResponse(repository.findByReservaId(reservaId)
                .orElseThrow(() -> new ResourceNotFoundException("No hay check-in para la reserva: " + reservaId)));
    }

    @Transactional
    public CheckinResponse create(CheckinRequest request) {
        Reserva reserva = reservaRepository.findById(request.reservaId())
                .orElseThrow(() -> new ResourceNotFoundException("Reserva no encontrada: " + request.reservaId()));

        if (reserva.getEstado() != EstadoReserva.PENDIENTE && reserva.getEstado() != EstadoReserva.CONFIRMADA) {
            throw new BusinessException("Solo una reserva PENDIENTE o CONFIRMADA puede pasar a check-in");
        }

        if (repository.findByReservaId(reserva.getId()).isPresent()) {
            throw new BusinessException("Esta reserva ya tiene un check-in registrado");
        }

        Habitacion habitacion = reserva.getHabitacion();

        Checkin checkin = Checkin.builder()
                .reserva(reserva)
                .huesped(reserva.getHuespedPrincipal())
                .habitacion(habitacion)
                .documentoVerificado(request.documentoVerificado())
                .observaciones(request.observaciones())
                .usuario(currentUserService.getUsuario())
                .build();

        Checkin saved = repository.save(checkin);

        reserva.setEstado(EstadoReserva.CHECK_IN);
        reserva.setUpdatedBy(currentUserService.getUsuario());
        reservaRepository.save(reserva);

        habitacion.setEstado(EstadoHabitacion.OCUPADA);
        habitacionRepository.save(habitacion);

        return toResponse(saved);
    }

    private CheckinResponse toResponse(Checkin checkin) {
        return new CheckinResponse(
                checkin.getId(),
                checkin.getReserva().getId(),
                checkin.getReserva().getCodigo(),
                huespedMapper.toResponse(checkin.getHuesped()),
                habitacionMapper.toResponse(checkin.getHabitacion()),
                checkin.getFechaHora(),
                checkin.getDocumentoVerificado(),
                checkin.getObservaciones()
        );
    }

    private Checkin getEntity(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Check-in no encontrado: " + id));
    }
}

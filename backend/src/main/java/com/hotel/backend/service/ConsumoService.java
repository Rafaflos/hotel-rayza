package com.hotel.backend.service;

import com.hotel.backend.dto.consumo.ConsumoRequest;
import com.hotel.backend.dto.consumo.ConsumoResponse;
import com.hotel.backend.dto.consumo.ServicioResponse;
import com.hotel.backend.entity.Consumo;
import com.hotel.backend.entity.EstadoReserva;
import com.hotel.backend.entity.Reserva;
import com.hotel.backend.entity.Servicio;
import com.hotel.backend.exception.BusinessException;
import com.hotel.backend.exception.ResourceNotFoundException;
import com.hotel.backend.repository.ConsumoRepository;
import com.hotel.backend.repository.ReservaRepository;
import com.hotel.backend.repository.ServicioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ConsumoService {

    private final ConsumoRepository repository;
    private final ReservaRepository reservaRepository;
    private final ServicioRepository servicioRepository;
    private final CurrentUserService currentUserService;

    public List<ConsumoResponse> findByReserva(Long reservaId) {
        return repository.findByReservaIdOrderByFechaHoraDesc(reservaId).stream().map(this::toResponse).toList();
    }

    public List<ServicioResponse> findServicios() {
        return servicioRepository.findAll().stream()
                .map(s -> new ServicioResponse(s.getId(), s.getNombre(), s.getDescripcion(), s.getPrecio()))
                .toList();
    }

    @Transactional
    public ConsumoResponse create(ConsumoRequest request) {
        Reserva reserva = reservaRepository.findById(request.reservaId())
                .orElseThrow(() -> new ResourceNotFoundException("Reserva no encontrada: " + request.reservaId()));

        if (reserva.getEstado() != EstadoReserva.CHECK_IN) {
            throw new BusinessException("Solo se pueden registrar consumos mientras el huésped está hospedado (CHECK_IN)");
        }

        Servicio servicio = request.servicioId() != null
                ? servicioRepository.findById(request.servicioId())
                    .orElseThrow(() -> new ResourceNotFoundException("Servicio no encontrado: " + request.servicioId()))
                : null;

        Consumo consumo = Consumo.builder()
                .reserva(reserva)
                .servicio(servicio)
                .descripcion(request.descripcion())
                .cantidad(request.cantidad())
                .precioUnitario(request.precioUnitario())
                .subtotal(request.cantidad().multiply(request.precioUnitario()))
                .usuario(currentUserService.getUsuario())
                .build();

        return toResponse(repository.save(consumo));
    }

    private ConsumoResponse toResponse(Consumo consumo) {
        return new ConsumoResponse(
                consumo.getId(),
                consumo.getReserva().getId(),
                consumo.getServicio() != null ? consumo.getServicio().getNombre() : null,
                consumo.getDescripcion(),
                consumo.getCantidad(),
                consumo.getPrecioUnitario(),
                consumo.getSubtotal(),
                consumo.getFechaHora()
        );
    }
}

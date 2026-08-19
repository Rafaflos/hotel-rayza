package com.hotel.backend.service;

import com.hotel.backend.dto.pago.MetodoPagoResponse;
import com.hotel.backend.dto.pago.PagoRequest;
import com.hotel.backend.dto.pago.PagoResponse;
import com.hotel.backend.entity.*;
import com.hotel.backend.exception.BusinessException;
import com.hotel.backend.exception.ResourceNotFoundException;
import com.hotel.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PagoService {

    private final PagoRepository repository;
    private final ReservaRepository reservaRepository;
    private final CheckoutRepository checkoutRepository;
    private final MetodoPagoRepository metodoPagoRepository;
    private final CajaRepository cajaRepository;
    private final CajaService cajaService;
    private final CurrentUserService currentUserService;

    public List<PagoResponse> findByReserva(Long reservaId) {
        return repository.findByReservaId(reservaId).stream().map(this::toResponse).toList();
    }

    public List<MetodoPagoResponse> findMetodosPago() {
        return metodoPagoRepository.findAll().stream()
                .map(m -> new MetodoPagoResponse(m.getId(), m.getNombre(), m.getDescripcion()))
                .toList();
    }

    @Transactional
    public PagoResponse create(PagoRequest request) {
        if (request.reservaId() == null && request.checkoutId() == null) {
            throw new BusinessException("El pago debe estar asociado a una reserva o a un check-out");
        }

        Reserva reserva = request.reservaId() != null
                ? reservaRepository.findById(request.reservaId())
                    .orElseThrow(() -> new ResourceNotFoundException("Reserva no encontrada: " + request.reservaId()))
                : null;

        Checkout checkout = request.checkoutId() != null
                ? checkoutRepository.findById(request.checkoutId())
                    .orElseThrow(() -> new ResourceNotFoundException("Check-out no encontrado: " + request.checkoutId()))
                : null;

        MetodoPago metodoPago = metodoPagoRepository.findById(request.metodoPagoId())
                .orElseThrow(() -> new ResourceNotFoundException("Método de pago no encontrado: " + request.metodoPagoId()));

        Caja cajaAbierta = cajaRepository.findFirstByEstadoOrderByFechaAperturaDesc(EstadoCaja.ABIERTA)
                .orElseThrow(() -> new BusinessException("No hay una caja abierta. Abre una caja antes de registrar pagos."));

        Pago pago = Pago.builder()
                .reserva(reserva)
                .checkout(checkout)
                .caja(cajaAbierta)
                .metodoPago(metodoPago)
                .monto(request.monto())
                .referencia(request.referencia())
                .observaciones(request.observaciones())
                .usuario(currentUserService.getUsuario())
                .build();

        Pago saved = repository.save(pago);

        String codigo = reserva != null ? reserva.getCodigo() : "checkout #" + checkout.getId();
        cajaService.registrarMovimiento(cajaAbierta, TipoMovimiento.INGRESO, "Pago " + codigo, request.monto(), saved);

        return toResponse(saved);
    }

    private PagoResponse toResponse(Pago pago) {
        return new PagoResponse(
                pago.getId(),
                pago.getReserva() != null ? pago.getReserva().getId() : null,
                pago.getReserva() != null ? pago.getReserva().getCodigo() : null,
                pago.getCheckout() != null ? pago.getCheckout().getId() : null,
                pago.getMetodoPago().getNombre(),
                pago.getMonto(),
                pago.getReferencia(),
                pago.getFechaHora(),
                pago.getEstado(),
                pago.getObservaciones()
        );
    }
}

package com.hotel.backend.service;

import com.hotel.backend.dto.egreso.LiquidarEgresoRequest;
import com.hotel.backend.dto.egreso.SolicitudEgresoRequest;
import com.hotel.backend.dto.egreso.SolicitudEgresoResponse;
import com.hotel.backend.entity.*;
import com.hotel.backend.exception.BusinessException;
import com.hotel.backend.exception.ResourceNotFoundException;
import com.hotel.backend.repository.CajaRepository;
import com.hotel.backend.repository.SolicitudEgresoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Caja chica en 3 pasos: el personal solicita permiso para un gasto, un
 * responsable lo aprueba o rechaza, y al volver de la compra se liquida con el
 * monto real. Solo al liquidar sale el dinero de la caja.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SolicitudEgresoService {

    private final SolicitudEgresoRepository repository;
    private final CajaRepository cajaRepository;
    private final CajaService cajaService;
    private final CurrentUserService currentUserService;

    public List<SolicitudEgresoResponse> findAll() {
        return repository.findAllByOrderByFechaSolicitudDesc().stream().map(this::toResponse).toList();
    }

    /** Lo que está esperando aprobación o esperando liquidarse. */
    public List<SolicitudEgresoResponse> findAbiertas() {
        return repository.findByEstadoInOrderByFechaSolicitudAsc(
                        List.of(EstadoSolicitudEgreso.PENDIENTE, EstadoSolicitudEgreso.APROBADA))
                .stream().map(this::toResponse).toList();
    }

    /** Las solicitudes del usuario que está usando el sistema. */
    public List<SolicitudEgresoResponse> findMias() {
        Usuario actual = currentUserService.getUsuario();
        if (actual == null) return List.of();
        return repository.findBySolicitanteIdOrderByFechaSolicitudDesc(actual.getId())
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public SolicitudEgresoResponse solicitar(SolicitudEgresoRequest request) {
        Caja cajaAbierta = cajaRepository.findFirstByEstadoOrderByFechaAperturaDesc(EstadoCaja.ABIERTA)
                .orElseThrow(() -> new BusinessException("No hay una caja abierta. Abre una caja antes de pedir un egreso."));

        SolicitudEgreso solicitud = SolicitudEgreso.builder()
                .caja(cajaAbierta)
                .concepto(request.concepto())
                .montoEstimado(request.montoEstimado())
                .observaciones(request.observaciones())
                .solicitante(currentUserService.getUsuario())
                .build();

        return toResponse(repository.save(solicitud));
    }

    @Transactional
    public SolicitudEgresoResponse aprobar(Long id) {
        SolicitudEgreso solicitud = getEntity(id);
        exigirPendiente(solicitud);
        solicitud.setEstado(EstadoSolicitudEgreso.APROBADA);
        solicitud.setAprobador(currentUserService.getUsuario());
        solicitud.setFechaResolucion(LocalDateTime.now());
        return toResponse(repository.save(solicitud));
    }

    @Transactional
    public SolicitudEgresoResponse rechazar(Long id, String motivo) {
        SolicitudEgreso solicitud = getEntity(id);
        exigirPendiente(solicitud);
        solicitud.setEstado(EstadoSolicitudEgreso.RECHAZADA);
        solicitud.setAprobador(currentUserService.getUsuario());
        solicitud.setFechaResolucion(LocalDateTime.now());
        if (motivo != null && !motivo.isBlank()) {
            solicitud.setObservaciones(motivo.trim());
        }
        return toResponse(repository.save(solicitud));
    }

    /** Cierra el ciclo: registra el gasto real y descuenta el dinero de la caja. */
    @Transactional
    public SolicitudEgresoResponse liquidar(Long id, LiquidarEgresoRequest request) {
        SolicitudEgreso solicitud = getEntity(id);

        if (solicitud.getEstado() != EstadoSolicitudEgreso.APROBADA) {
            throw new BusinessException("Solo se puede liquidar una solicitud APROBADA");
        }

        Caja cajaAbierta = cajaRepository.findFirstByEstadoOrderByFechaAperturaDesc(EstadoCaja.ABIERTA)
                .orElseThrow(() -> new BusinessException("No hay una caja abierta para registrar el egreso."));

        cajaService.registrarMovimiento(
                cajaAbierta,
                TipoMovimiento.EGRESO,
                solicitud.getConcepto(),
                request.montoReal(),
                null);

        solicitud.setEstado(EstadoSolicitudEgreso.LIQUIDADA);
        solicitud.setMontoReal(request.montoReal());
        solicitud.setComprobanteReferencia(request.comprobanteReferencia());
        solicitud.setFechaLiquidacion(LocalDateTime.now());
        if (request.observaciones() != null && !request.observaciones().isBlank()) {
            solicitud.setObservaciones(request.observaciones().trim());
        }

        return toResponse(repository.save(solicitud));
    }

    private void exigirPendiente(SolicitudEgreso solicitud) {
        if (solicitud.getEstado() != EstadoSolicitudEgreso.PENDIENTE) {
            throw new BusinessException("Esta solicitud ya fue resuelta");
        }
    }

    private SolicitudEgresoResponse toResponse(SolicitudEgreso s) {
        return new SolicitudEgresoResponse(
                s.getId(),
                s.getConcepto(),
                s.getMontoEstimado(),
                s.getMontoReal(),
                s.getEstado(),
                s.getComprobanteReferencia(),
                s.getObservaciones(),
                s.getSolicitante() != null
                        ? s.getSolicitante().getNombres() + " " + s.getSolicitante().getApellidos()
                        : null,
                s.getAprobador() != null
                        ? s.getAprobador().getNombres() + " " + s.getAprobador().getApellidos()
                        : null,
                s.getFechaSolicitud(),
                s.getFechaResolucion(),
                s.getFechaLiquidacion()
        );
    }

    private SolicitudEgreso getEntity(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitud de egreso no encontrada: " + id));
    }
}

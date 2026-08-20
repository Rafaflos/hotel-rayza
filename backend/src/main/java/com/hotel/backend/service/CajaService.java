package com.hotel.backend.service;

import com.hotel.backend.dto.caja.AbrirCajaRequest;
import com.hotel.backend.dto.caja.CajaResponse;
import com.hotel.backend.dto.caja.CerrarCajaRequest;
import com.hotel.backend.dto.caja.MovimientoCajaResponse;
import com.hotel.backend.entity.*;
import com.hotel.backend.exception.BusinessException;
import com.hotel.backend.exception.ResourceNotFoundException;
import com.hotel.backend.repository.CajaRepository;
import com.hotel.backend.repository.MovimientoCajaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CajaService {

    private final CajaRepository repository;
    private final MovimientoCajaRepository movimientoRepository;
    private final CurrentUserService currentUserService;

    public List<CajaResponse> findAll() {
        return repository.findAll().stream().map(this::toResponse).toList();
    }

    public CajaResponse findAbierta() {
        Caja caja = repository.findFirstByEstadoOrderByFechaAperturaDesc(EstadoCaja.ABIERTA)
                .orElseThrow(() -> new ResourceNotFoundException("No hay ninguna caja abierta"));
        return toResponse(caja);
    }

    public List<MovimientoCajaResponse> findMovimientos(Long cajaId) {
        return movimientoRepository.findByCajaIdOrderByFechaHoraDesc(cajaId).stream().map(this::toResponse).toList();
    }

    @Transactional
    public CajaResponse abrir(AbrirCajaRequest request) {
        if (repository.findFirstByEstadoOrderByFechaAperturaDesc(EstadoCaja.ABIERTA).isPresent()) {
            throw new BusinessException("Ya hay una caja abierta. Ciérrala antes de abrir una nueva.");
        }

        Caja caja = Caja.builder()
                .fecha(LocalDate.now())
                .usuarioApertura(currentUserService.getUsuario())
                .montoInicial(request.montoInicial())
                .observaciones(request.observaciones())
                .build();

        return toResponse(repository.save(caja));
    }

    @Transactional
    public CajaResponse cerrar(Long id, CerrarCajaRequest request) {
        Caja caja = getEntity(id);

        if (caja.getEstado() != EstadoCaja.ABIERTA) {
            throw new BusinessException("La caja ya está cerrada");
        }

        BigDecimal montoEsperado = caja.getMontoInicial().add(caja.getTotalIngresos()).subtract(caja.getTotalEgresos());

        caja.setMontoFinal(request.montoContado());
        caja.setDiferencia(request.montoContado().subtract(montoEsperado));
        caja.setEstado(EstadoCaja.CERRADA);
        caja.setFechaCierre(java.time.LocalDateTime.now());
        caja.setUsuarioCierre(currentUserService.getUsuario());
        if (request.observaciones() != null) {
            caja.setObservaciones(request.observaciones());
        }

        return toResponse(repository.save(caja));
    }

    @Transactional
    public void registrarMovimiento(Caja caja, TipoMovimiento tipo, String concepto, BigDecimal monto, Pago pago) {
        MovimientoCaja movimiento = MovimientoCaja.builder()
                .caja(caja)
                .tipo(tipo)
                .concepto(concepto)
                .monto(monto)
                .pago(pago)
                .usuario(currentUserService.getUsuario())
                .build();
        movimientoRepository.save(movimiento);

        if (tipo == TipoMovimiento.INGRESO) {
            caja.setTotalIngresos(caja.getTotalIngresos().add(monto));
        } else {
            caja.setTotalEgresos(caja.getTotalEgresos().add(monto));
        }
        repository.save(caja);
    }

    private CajaResponse toResponse(Caja caja) {
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
                caja.getObservaciones(),
                caja.getMontoInicial().add(caja.getTotalIngresos()).subtract(caja.getTotalEgresos()),
                esMiTurno(caja)
        );
    }

    /** true si el turno lo abrió el usuario que está consultando ahora mismo. */
    private boolean esMiTurno(Caja caja) {
        Usuario actual = currentUserService.getUsuario();
        return actual != null
                && caja.getUsuarioApertura() != null
                && actual.getId().equals(caja.getUsuarioApertura().getId());
    }

    private MovimientoCajaResponse toResponse(MovimientoCaja movimiento) {
        return new MovimientoCajaResponse(
                movimiento.getId(),
                movimiento.getTipo(),
                movimiento.getConcepto(),
                movimiento.getMonto(),
                movimiento.getPago() != null ? movimiento.getPago().getId() : null,
                movimiento.getFechaHora(),
                movimiento.getObservaciones()
        );
    }

    private Caja getEntity(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Caja no encontrada: " + id));
    }
}

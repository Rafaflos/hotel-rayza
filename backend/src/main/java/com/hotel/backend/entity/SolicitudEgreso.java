package com.hotel.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Caja chica: el personal pide permiso para un gasto, un responsable lo aprueba,
 * se hace la compra y luego se liquida con el monto real y el comprobante.
 * Al liquidar se genera el movimiento de EGRESO en la caja del turno.
 */
@Entity
@Table(name = "solicitudes_egreso")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SolicitudEgreso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "caja_id")
    private Caja caja;

    @Column(nullable = false, length = 255)
    private String concepto;

    @Column(name = "monto_estimado", nullable = false, precision = 10, scale = 2)
    private BigDecimal montoEstimado;

    @Column(name = "monto_real", precision = 10, scale = 2)
    private BigDecimal montoReal;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private EstadoSolicitudEgreso estado = EstadoSolicitudEgreso.PENDIENTE;

    @Column(name = "comprobante_referencia", length = 255)
    private String comprobanteReferencia;

    @Column(columnDefinition = "TEXT")
    private String observaciones;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "solicitante_id")
    private Usuario solicitante;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aprobador_id")
    private Usuario aprobador;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movimiento_caja_id")
    private MovimientoCaja movimientoCaja;

    @Column(name = "fecha_solicitud", nullable = false)
    @Builder.Default
    private LocalDateTime fechaSolicitud = LocalDateTime.now();

    @Column(name = "fecha_resolucion")
    private LocalDateTime fechaResolucion;

    @Column(name = "fecha_liquidacion")
    private LocalDateTime fechaLiquidacion;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}

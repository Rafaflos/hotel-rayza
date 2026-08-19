package com.hotel.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "cajas")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Caja {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate fecha;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_apertura_id")
    private Usuario usuarioApertura;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_cierre_id")
    private Usuario usuarioCierre;

    @Column(name = "monto_inicial", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal montoInicial = BigDecimal.ZERO;

    @Column(name = "monto_final", precision = 10, scale = 2)
    private BigDecimal montoFinal;

    @Column(name = "total_ingresos", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal totalIngresos = BigDecimal.ZERO;

    @Column(name = "total_egresos", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal totalEgresos = BigDecimal.ZERO;

    @Column(precision = 10, scale = 2)
    private BigDecimal diferencia;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    @Builder.Default
    private EstadoCaja estado = EstadoCaja.ABIERTA;

    @Column(name = "fecha_apertura", nullable = false)
    @Builder.Default
    private LocalDateTime fechaApertura = LocalDateTime.now();

    @Column(name = "fecha_cierre")
    private LocalDateTime fechaCierre;

    @Column(columnDefinition = "TEXT")
    private String observaciones;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}

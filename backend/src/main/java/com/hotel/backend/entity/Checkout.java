package com.hotel.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "checkouts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Checkout {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reserva_id", nullable = false, unique = true)
    private Reserva reserva;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "huesped_id", nullable = false)
    private Huesped huesped;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "habitacion_id", nullable = false)
    private Habitacion habitacion;

    @Column(name = "fecha_hora", nullable = false)
    @Builder.Default
    private LocalDateTime fechaHora = LocalDateTime.now();

    @Column(name = "subtotal_hospedaje", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal subtotalHospedaje = BigDecimal.ZERO;

    @Column(name = "subtotal_consumos", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal subtotalConsumos = BigDecimal.ZERO;

    @Column(name = "subtotal_servicios", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal subtotalServicios = BigDecimal.ZERO;

    @Column(nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal descuento = BigDecimal.ZERO;

    @Column(nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal total = BigDecimal.ZERO;

    @Column(columnDefinition = "TEXT")
    private String observaciones;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}

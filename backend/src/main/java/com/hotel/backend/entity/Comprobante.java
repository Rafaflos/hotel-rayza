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
@Table(name = "comprobantes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comprobante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reserva_id")
    private Reserva reserva;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "checkout_id")
    private Checkout checkout;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pago_id")
    private Pago pago;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private TipoComprobante tipo;

    @Column(length = 20)
    private String serie;

    @Column(length = 30)
    private String numero;

    @Column(name = "fecha_emision", nullable = false)
    @Builder.Default
    private LocalDateTime fechaEmision = LocalDateTime.now();

    @Column(name = "cliente_tipo_documento", length = 20)
    private String clienteTipoDocumento;

    @Column(name = "cliente_numero_documento", length = 30)
    private String clienteNumeroDocumento;

    @Column(name = "cliente_nombre", length = 255)
    private String clienteNombre;

    @Column(nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal subtotal = BigDecimal.ZERO;

    @Column(nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal descuento = BigDecimal.ZERO;

    @Column(nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal impuesto = BigDecimal.ZERO;

    @Column(nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal total = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    @Builder.Default
    private EstadoComprobante estado = EstadoComprobante.EMITIDO;

    @Column(name = "sunat_aceptada")
    private Boolean sunatAceptada;

    @Column(name = "sunat_descripcion", length = 500)
    private String sunatDescripcion;

    @Column(name = "sunat_enlace_pdf", length = 500)
    private String sunatEnlacePdf;

    @Column(name = "sunat_enlace_xml", length = 500)
    private String sunatEnlaceXml;

    @Column(name = "sunat_enlace_cdr", length = 500)
    private String sunatEnlaceCdr;

    @Column(name = "sunat_codigo_hash", length = 255)
    private String sunatCodigoHash;

    @Column(name = "sunat_respuesta_json", columnDefinition = "TEXT")
    private String sunatRespuestaJson;

    @Column(columnDefinition = "TEXT")
    private String observaciones;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}

package com.hotel.backend.service;

import tools.jackson.databind.ObjectMapper;
import com.hotel.backend.dto.comprobante.ComprobanteRequest;
import com.hotel.backend.dto.comprobante.ComprobanteResponse;
import com.hotel.backend.entity.Checkout;
import com.hotel.backend.entity.Comprobante;
import com.hotel.backend.entity.EstadoComprobante;
import com.hotel.backend.entity.Huesped;
import com.hotel.backend.entity.TipoComprobante;
import com.hotel.backend.exception.BusinessException;
import com.hotel.backend.exception.ResourceNotFoundException;
import com.hotel.backend.repository.CheckoutRepository;
import com.hotel.backend.repository.ComprobanteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class ComprobanteService {

    private final ComprobanteRepository repository;
    private final CheckoutRepository checkoutRepository;
    private final NubefactService nubefactService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${nubefact.serie.factura}")
    private String serieFactura;

    @Value("${nubefact.serie.boleta}")
    private String serieBoleta;

    private Map<TipoComprobante, String> series() {
        return Map.of(
                TipoComprobante.BOLETA, serieBoleta,
                TipoComprobante.FACTURA, serieFactura,
                TipoComprobante.RECIBO, "R001",
                TipoComprobante.NOTA, "N001"
        );
    }

    public List<ComprobanteResponse> findAll() {
        return repository.findAllByOrderByFechaEmisionDesc().stream().map(this::toResponse).toList();
    }

    public List<ComprobanteResponse> findByCheckout(Long checkoutId) {
        return repository.findByCheckoutId(checkoutId).stream().map(this::toResponse).toList();
    }

    @Transactional
    public ComprobanteResponse create(ComprobanteRequest request) {
        Checkout checkout = checkoutRepository.findById(request.checkoutId())
                .orElseThrow(() -> new ResourceNotFoundException("Check-out no encontrado: " + request.checkoutId()));

        Huesped huesped = checkout.getHuesped();
        String serie = series().get(request.tipo());
        long correlativo = repository.countByTipoAndSerie(request.tipo(), serie) + 1;
        String numero = String.format("%06d", correlativo);

        Comprobante comprobante = Comprobante.builder()
                .reserva(checkout.getReserva())
                .checkout(checkout)
                .tipo(request.tipo())
                .serie(serie)
                .numero(numero)
                .clienteTipoDocumento(huesped.getTipoDocumento())
                .clienteNumeroDocumento(huesped.getNumeroDocumento())
                .clienteNombre(huesped.getNombres() + " " + huesped.getApellidos())
                .subtotal(checkout.getTotal())
                .descuento(BigDecimal.ZERO)
                .impuesto(BigDecimal.ZERO)
                .total(checkout.getTotal())
                .observaciones(request.observaciones())
                .build();

        Comprobante saved = repository.save(comprobante);

        if (request.tipo() == TipoComprobante.BOLETA || request.tipo() == TipoComprobante.FACTURA) {
            String descripcion = "Servicios de hospedaje"
                    + (checkout.getReserva() != null ? " — " + checkout.getReserva().getCodigo() : "");
            String codigoUnico = "COMPROBANTE-" + saved.getId();

            Map<String, Object> json = nubefactService.construirJsonEmision(saved, serie, codigoUnico, descripcion);
            enviarYActualizar(saved, json);
            saved = repository.save(saved);
        }

        return toResponse(saved);
    }

    @Transactional
    public ComprobanteResponse anular(Long id, String motivo) {
        Comprobante comprobante = getEntity(id);
        if (comprobante.getEstado() == EstadoComprobante.ANULADO) {
            throw new BusinessException("Este comprobante ya está anulado");
        }
        if (motivo == null || motivo.isBlank()) {
            throw new BusinessException("El motivo de anulación es obligatorio");
        }

        if (comprobante.getTipo() == TipoComprobante.BOLETA || comprobante.getTipo() == TipoComprobante.FACTURA) {
            Map<String, Object> json = nubefactService.construirJsonAnulacion(comprobante, motivo);
            try {
                Map<String, Object> respuesta = nubefactService.enviar(json);
                if (respuesta != null) {
                    comprobante.setSunatRespuestaJson(escribirJson(respuesta));
                }
            } catch (Exception e) {
                log.error("No se pudo comunicar la anulación de {}-{} a Nubefact",
                        comprobante.getSerie(), comprobante.getNumero(), e);
                throw new BusinessException("No se pudo anular en SUNAT: " + e.getMessage());
            }
        }

        comprobante.setEstado(EstadoComprobante.ANULADO);
        comprobante.setObservaciones(
                (comprobante.getObservaciones() != null ? comprobante.getObservaciones() + " — " : "")
                        + "Anulado: " + motivo.trim());

        return toResponse(repository.save(comprobante));
    }

    private void enviarYActualizar(Comprobante comprobante, Map<String, Object> json) {
        try {
            Map<String, Object> respuesta = nubefactService.enviar(json);
            if (respuesta == null) {
                return;
            }
            comprobante.setSunatAceptada(Boolean.TRUE.equals(respuesta.get("aceptada_por_sunat")));
            comprobante.setSunatDescripcion((String) respuesta.get("sunat_description"));
            comprobante.setSunatEnlacePdf((String) respuesta.get("enlace_del_pdf"));
            comprobante.setSunatEnlaceXml((String) respuesta.get("enlace_del_xml"));
            comprobante.setSunatEnlaceCdr((String) respuesta.get("enlace_del_cdr"));
            comprobante.setSunatCodigoHash((String) respuesta.get("codigo_hash"));
            comprobante.setSunatRespuestaJson(escribirJson(respuesta));

            // Se pidió "#" (auto-correlativo): Nubefact es el dueño del número real.
            Object nro = respuesta.get("numero");
            if (nro != null) {
                comprobante.setNumero(String.format("%06d", Long.parseLong(String.valueOf(nro).trim())));
            }
        } catch (Exception e) {
            log.error("No se pudo enviar el comprobante {}-{} a Nubefact",
                    comprobante.getSerie(), comprobante.getNumero(), e);
            comprobante.setSunatAceptada(false);
            comprobante.setSunatDescripcion("Error al conectar con Nubefact: " + e.getMessage());
        }
    }

    private String escribirJson(Map<String, Object> mapa) {
        try {
            return objectMapper.writeValueAsString(mapa);
        } catch (Exception e) {
            return null;
        }
    }

    private ComprobanteResponse toResponse(Comprobante comprobante) {
        return new ComprobanteResponse(
                comprobante.getId(),
                comprobante.getTipo(),
                comprobante.getSerie(),
                comprobante.getNumero(),
                comprobante.getFechaEmision(),
                comprobante.getClienteTipoDocumento(),
                comprobante.getClienteNumeroDocumento(),
                comprobante.getClienteNombre(),
                comprobante.getReserva() != null ? comprobante.getReserva().getCodigo() : null,
                comprobante.getCheckout() != null ? comprobante.getCheckout().getHabitacion().getNumero() : null,
                comprobante.getSubtotal(),
                comprobante.getDescuento(),
                comprobante.getImpuesto(),
                comprobante.getTotal(),
                comprobante.getEstado(),
                comprobante.getObservaciones(),
                comprobante.getSunatAceptada(),
                comprobante.getSunatDescripcion(),
                comprobante.getSunatEnlacePdf()
        );
    }

    private Comprobante getEntity(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comprobante no encontrado: " + id));
    }
}

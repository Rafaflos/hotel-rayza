package com.hotel.backend.service;

import com.hotel.backend.entity.Comprobante;
import com.hotel.backend.entity.TipoComprobante;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Arma el JSON con el formato que exige la API de Nubefact (https://www.nubefact.com/integracion)
 * y lo envía si nubefact.enabled=true. Formato verificado contra una integración ya en
 * producción (TransporteRayza) para la misma cuenta/región.
 *
 * Hotel Rayza opera en la Amazonía (Loreto) — Ley 27037: la operación va exonerada de
 * IGV, no gravada. Todo el monto entra en total_exonerada, total_igv = 0, y cada ítem
 * lleva tipo_de_igv = 8 (Exonerado - Operación Onerosa).
 */
@Service
@Slf4j
public class NubefactService {

    private static final DateTimeFormatter FECHA_FORMAT = DateTimeFormatter.ofPattern("dd-MM-yyyy");

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${nubefact.enabled:false}")
    private boolean enabled;

    @Value("${nubefact.url:}")
    private String url;

    @Value("${nubefact.token:}")
    private String token;

    public boolean isEnabled() {
        return enabled;
    }

    // Códigos Nubefact: 1 = FACTURA, 2 = BOLETA
    private int codigoTipo(TipoComprobante tipo) {
        return tipo == TipoComprobante.FACTURA ? 1 : 2;
    }

    public Map<String, Object> construirJsonEmision(Comprobante c, String serie, String codigoUnico, String descripcion) {
        Map<String, Object> json = new LinkedHashMap<>();
        json.put("operacion", "generar_comprobante");
        json.put("tipo_de_comprobante", codigoTipo(c.getTipo()));
        json.put("serie", serie);
        // "#" = Nubefact asigna el correlativo que le corresponde a la serie, así nuestro
        // número nunca se desincroniza del suyo. Con "#" exige codigo_unico (error 21):
        // usamos el id local del comprobante, estable ante reintentos.
        json.put("numero", "#");
        json.put("codigo_unico", codigoUnico);
        json.put("sunat_transaction", 1);
        json.put("cliente_tipo_de_documento", codigoTipoDocumento(c.getClienteTipoDocumento()));
        json.put("cliente_numero_de_documento", c.getClienteNumeroDocumento());
        json.put("cliente_denominacion", c.getClienteNombre());
        json.put("cliente_direccion", "-");
        json.put("fecha_de_emision", c.getFechaEmision().toLocalDate().format(FECHA_FORMAT));
        json.put("moneda", 1); // 1 = Soles (PEN)
        json.put("porcentaje_de_igv", new BigDecimal("18.00")); // tasa legal vigente; Nubefact la exige aunque esté exonerada
        json.put("total_gravada", BigDecimal.ZERO);
        json.put("total_exonerada", c.getTotal());
        json.put("total_igv", BigDecimal.ZERO);
        json.put("total", c.getTotal());
        json.put("observaciones", c.getObservaciones() != null ? c.getObservaciones() : "");
        json.put("enviar_automaticamente_a_la_sunat", true);
        json.put("enviar_automaticamente_al_cliente", false);

        Map<String, Object> item = new LinkedHashMap<>();
        item.put("unidad_de_medida", "ZZ"); // ZZ = servicio
        item.put("codigo", "HOSPEDAJE");
        item.put("descripcion", descripcion);
        item.put("cantidad", 1);
        item.put("valor_unitario", c.getTotal()); // exonerado: valor = precio, sin IGV
        item.put("precio_unitario", c.getTotal());
        item.put("subtotal", c.getTotal());
        item.put("tipo_de_igv", 8); // 8 = Exonerado - Operación Onerosa
        item.put("igv", BigDecimal.ZERO);
        item.put("total", c.getTotal());
        item.put("anticipo_regularizacion", false);
        json.put("items", List.of(item));

        return json;
    }

    public Map<String, Object> construirJsonAnulacion(Comprobante c, String motivo) {
        Map<String, Object> json = new LinkedHashMap<>();
        json.put("operacion", "generar_anulacion");
        json.put("tipo_de_comprobante", codigoTipo(c.getTipo()));
        json.put("serie", c.getSerie());
        json.put("numero", c.getNumero());
        json.put("motivo", motivo);
        json.put("codigo_unico", "");
        return json;
    }

    /** Códigos SUNAT/Nubefact de tipo de documento: 1=DNI, 4=CE, 6=RUC, 7=Pasaporte. */
    private int codigoTipoDocumento(String tipoDocumento) {
        if (tipoDocumento == null) return 1;
        return switch (tipoDocumento.trim().toUpperCase()) {
            case "RUC" -> 6;
            case "CE", "CARNET EXTRANJERIA", "CARNET DE EXTRANJERIA" -> 4;
            case "PASAPORTE" -> 7;
            default -> 1;
        };
    }

    /**
     * Envía el JSON a Nubefact. Devuelve el cuerpo de la respuesta, o null si la
     * integración está deshabilitada (modo local, no se llega a llamar la API).
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> enviar(Map<String, Object> json) {
        if (!enabled) return null;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Token token=\"" + token + "\"");

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(json, headers);
        ResponseEntity<Map> respuesta = restTemplate.postForEntity(url, entity, Map.class);

        Map<String, Object> body = respuesta.getBody();
        if (body != null && body.get("errors") != null) {
            log.error("Nubefact rechazó el comprobante: {}", body.get("errors"));
            throw new RuntimeException("Nubefact rechazó el comprobante: " + body.get("errors"));
        }
        return body;
    }
}

package com.hotel.backend.repository;

import com.hotel.backend.entity.Comprobante;
import com.hotel.backend.entity.TipoComprobante;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComprobanteRepository extends JpaRepository<Comprobante, Long> {
    long countByTipoAndSerie(TipoComprobante tipo, String serie);
    List<Comprobante> findAllByOrderByFechaEmisionDesc();
    List<Comprobante> findByCheckoutId(Long checkoutId);
}

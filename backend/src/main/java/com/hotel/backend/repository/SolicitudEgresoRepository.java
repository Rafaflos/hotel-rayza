package com.hotel.backend.repository;

import com.hotel.backend.entity.EstadoSolicitudEgreso;
import com.hotel.backend.entity.SolicitudEgreso;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SolicitudEgresoRepository extends JpaRepository<SolicitudEgreso, Long> {
    List<SolicitudEgreso> findAllByOrderByFechaSolicitudDesc();
    List<SolicitudEgreso> findByEstadoInOrderByFechaSolicitudAsc(List<EstadoSolicitudEgreso> estados);
    List<SolicitudEgreso> findBySolicitanteIdOrderByFechaSolicitudDesc(Long solicitanteId);
    long countByEstado(EstadoSolicitudEgreso estado);
}

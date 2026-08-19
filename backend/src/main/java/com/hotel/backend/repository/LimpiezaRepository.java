package com.hotel.backend.repository;

import com.hotel.backend.entity.EstadoLimpieza;
import com.hotel.backend.entity.Limpieza;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LimpiezaRepository extends JpaRepository<Limpieza, Long> {
    List<Limpieza> findByEstadoInOrderByFechaHoraAsc(List<EstadoLimpieza> estados);
    List<Limpieza> findAllByOrderByFechaHoraDesc();
}

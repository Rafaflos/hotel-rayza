package com.hotel.backend.repository;

import com.hotel.backend.entity.MovimientoCaja;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MovimientoCajaRepository extends JpaRepository<MovimientoCaja, Long> {
    List<MovimientoCaja> findByCajaIdOrderByFechaHoraDesc(Long cajaId);
}

package com.hotel.backend.repository;

import com.hotel.backend.entity.Caja;
import com.hotel.backend.entity.EstadoCaja;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface CajaRepository extends JpaRepository<Caja, Long> {
    Optional<Caja> findFirstByEstadoOrderByFechaAperturaDesc(EstadoCaja estado);
    List<Caja> findByFechaBetween(LocalDate desde, LocalDate hasta);
}

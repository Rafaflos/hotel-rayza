package com.hotel.backend.repository;

import com.hotel.backend.entity.Consumo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface ConsumoRepository extends JpaRepository<Consumo, Long> {
    List<Consumo> findByReservaIdOrderByFechaHoraDesc(Long reservaId);

    @Query("SELECT COALESCE(SUM(c.subtotal), 0) FROM Consumo c WHERE c.reserva.id = :reservaId")
    BigDecimal sumByReserva(@Param("reservaId") Long reservaId);
}

package com.hotel.backend.repository;

import com.hotel.backend.entity.Pago;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface PagoRepository extends JpaRepository<Pago, Long> {
    List<Pago> findByReservaId(Long reservaId);
    List<Pago> findByFechaHoraBetween(LocalDateTime start, LocalDateTime end);

    @Query("""
            SELECT COALESCE(SUM(p.monto), 0) FROM Pago p
            WHERE p.fechaHora BETWEEN :start AND :end
              AND p.estado = com.hotel.backend.entity.EstadoPago.CONFIRMADO
            """)
    BigDecimal sumConfirmadosBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    /** Total ya pagado de una reserva (solo pagos confirmados). */
    @Query("""
            SELECT COALESCE(SUM(p.monto), 0) FROM Pago p
            WHERE p.reserva.id = :reservaId
              AND p.estado = com.hotel.backend.entity.EstadoPago.CONFIRMADO
            """)
    BigDecimal sumConfirmadosByReserva(@Param("reservaId") Long reservaId);
}

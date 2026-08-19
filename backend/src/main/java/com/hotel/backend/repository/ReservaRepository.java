package com.hotel.backend.repository;

import com.hotel.backend.entity.EstadoReserva;
import com.hotel.backend.entity.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    Optional<Reserva> findByCodigo(String codigo);

    List<Reserva> findByEstado(EstadoReserva estado);

    long countByFechaEntrada(LocalDate fechaEntrada);

    List<Reserva> findByFechaEntradaBetween(LocalDate desde, LocalDate hasta);

    @Query("""
            SELECT r FROM Reserva r
            WHERE r.habitacion.id = :habitacionId
              AND r.estado NOT IN (com.hotel.backend.entity.EstadoReserva.CANCELADA, com.hotel.backend.entity.EstadoReserva.NO_SHOW, com.hotel.backend.entity.EstadoReserva.CHECK_OUT)
              AND r.fechaEntrada < :fechaSalida
              AND r.fechaSalida > :fechaEntrada
              AND (:excludeReservaId IS NULL OR r.id <> :excludeReservaId)
            """)
    List<Reserva> findConflictos(
            @Param("habitacionId") Long habitacionId,
            @Param("fechaEntrada") LocalDate fechaEntrada,
            @Param("fechaSalida") LocalDate fechaSalida,
            @Param("excludeReservaId") Long excludeReservaId
    );
}

package com.hotel.backend.repository;

import com.hotel.backend.entity.Checkin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface CheckinRepository extends JpaRepository<Checkin, Long> {
    Optional<Checkin> findByReservaId(Long reservaId);
    List<Checkin> findByFechaHoraBetween(LocalDateTime start, LocalDateTime end);
    long countByFechaHoraBetween(LocalDateTime start, LocalDateTime end);
}

package com.hotel.backend.repository;

import com.hotel.backend.entity.Checkout;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface CheckoutRepository extends JpaRepository<Checkout, Long> {
    Optional<Checkout> findByReservaId(Long reservaId);
    List<Checkout> findByFechaHoraBetween(LocalDateTime start, LocalDateTime end);
    long countByFechaHoraBetween(LocalDateTime start, LocalDateTime end);
}

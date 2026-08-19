package com.hotel.backend.repository;

import com.hotel.backend.entity.Servicio;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServicioRepository extends JpaRepository<Servicio, Long> {
}

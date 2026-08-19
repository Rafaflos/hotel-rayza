package com.hotel.backend.repository;

import com.hotel.backend.entity.EstadoHabitacion;
import com.hotel.backend.entity.Habitacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HabitacionRepository extends JpaRepository<Habitacion, Long> {
    Optional<Habitacion> findByNumero(String numero);
    boolean existsByNumero(String numero);
    List<Habitacion> findByEstado(EstadoHabitacion estado);
    long countByEstado(EstadoHabitacion estado);
}

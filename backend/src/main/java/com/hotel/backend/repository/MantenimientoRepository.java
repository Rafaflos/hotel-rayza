package com.hotel.backend.repository;

import com.hotel.backend.entity.EstadoMantenimiento;
import com.hotel.backend.entity.Mantenimiento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MantenimientoRepository extends JpaRepository<Mantenimiento, Long> {
    List<Mantenimiento> findByEstadoInOrderByPrioridadDescFechaAsc(List<EstadoMantenimiento> estados);
    List<Mantenimiento> findAllByOrderByFechaDesc();
}

package com.hotel.backend.repository;

import com.hotel.backend.entity.Empleado;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmpleadoRepository extends JpaRepository<Empleado, Long> {
    boolean existsByNumeroDocumento(String numeroDocumento);
    List<Empleado> findByActivoTrueOrderByApellidosAsc();
}

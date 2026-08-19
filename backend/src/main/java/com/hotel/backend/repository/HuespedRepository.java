package com.hotel.backend.repository;

import com.hotel.backend.entity.Huesped;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HuespedRepository extends JpaRepository<Huesped, Long> {
    Optional<Huesped> findByNumeroDocumento(String numeroDocumento);
    boolean existsByNumeroDocumento(String numeroDocumento);
    List<Huesped> findByApellidosContainingIgnoreCaseOrNombresContainingIgnoreCase(String apellidos, String nombres);
}

package com.hotel.backend.repository;

import com.hotel.backend.entity.AvisoLeido;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AvisoLeidoRepository extends JpaRepository<AvisoLeido, AvisoLeido.AvisoLeidoId> {
    List<AvisoLeido> findByUsuarioId(Long usuarioId);
    boolean existsByAvisoIdAndUsuarioId(Long avisoId, Long usuarioId);
}

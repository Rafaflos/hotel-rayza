package com.hotel.backend.repository;

import com.hotel.backend.entity.Aviso;
import com.hotel.backend.entity.CategoriaAviso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AvisoRepository extends JpaRepository<Aviso, Long> {

    List<Aviso> findAllByOrderByFechaHoraDesc();

    List<Aviso> findByCategoriaOrderByFechaHoraDesc(CategoriaAviso categoria);

    List<Aviso> findByResueltoFalseOrderByFechaHoraDesc();

    /** Avisos sin resolver que este usuario todavía no ha leído. */
    @Query("""
            SELECT COUNT(a) FROM Aviso a
            WHERE a.resuelto = false
              AND NOT EXISTS (
                SELECT 1 FROM AvisoLeido l
                WHERE l.avisoId = a.id AND l.usuarioId = :usuarioId
              )
            """)
    long countNoLeidos(@Param("usuarioId") Long usuarioId);
}

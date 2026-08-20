package com.hotel.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;

/** Marca qué usuario ya leyó qué aviso (para el contador de no leídos). */
@Entity
@Table(name = "avisos_leidos")
@IdClass(AvisoLeido.AvisoLeidoId.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AvisoLeido {

    @Id
    @Column(name = "aviso_id")
    private Long avisoId;

    @Id
    @Column(name = "usuario_id")
    private Long usuarioId;

    @Column(name = "fecha_lectura", nullable = false)
    @Builder.Default
    private LocalDateTime fechaLectura = LocalDateTime.now();

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AvisoLeidoId implements Serializable {
        private Long avisoId;
        private Long usuarioId;

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (!(o instanceof AvisoLeidoId that)) return false;
            return Objects.equals(avisoId, that.avisoId) && Objects.equals(usuarioId, that.usuarioId);
        }

        @Override
        public int hashCode() {
            return Objects.hash(avisoId, usuarioId);
        }
    }
}

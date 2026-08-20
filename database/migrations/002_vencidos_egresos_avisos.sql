-- ============================================================
-- Control de estancias vencidas, egresos con aprobación y
-- avisos internos del personal.
-- Aplicado el 2026-08-19.
-- ============================================================

-- --- Estancias vencidas: hora límite de salida y cargo por día extra ---
ALTER TABLE reservas
  ADD COLUMN hora_limite_salida TIME NOT NULL DEFAULT '13:00:00' AFTER fecha_salida,
  ADD COLUMN dias_extra INT UNSIGNED NOT NULL DEFAULT 0 AFTER cantidad_noches,
  ADD COLUMN cargo_extra DECIMAL(10,2) NOT NULL DEFAULT 0 AFTER dias_extra;


-- --- Caja chica: solicitud de egreso con aprobación y liquidación ---
CREATE TABLE solicitudes_egreso (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    caja_id BIGINT UNSIGNED NULL,
    concepto VARCHAR(255) NOT NULL,
    monto_estimado DECIMAL(10,2) NOT NULL,
    monto_real DECIMAL(10,2) NULL,
    estado ENUM('PENDIENTE','APROBADA','RECHAZADA','LIQUIDADA') NOT NULL DEFAULT 'PENDIENTE',
    comprobante_referencia VARCHAR(255) NULL,
    observaciones TEXT NULL,
    solicitante_id BIGINT UNSIGNED NULL,
    aprobador_id BIGINT UNSIGNED NULL,
    movimiento_caja_id BIGINT UNSIGNED NULL,
    fecha_solicitud DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_resolucion DATETIME NULL,
    fecha_liquidacion DATETIME NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_solegr_caja FOREIGN KEY (caja_id) REFERENCES cajas(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_solegr_solicitante FOREIGN KEY (solicitante_id) REFERENCES usuarios(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_solegr_aprobador FOREIGN KEY (aprobador_id) REFERENCES usuarios(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_solegr_movimiento FOREIGN KEY (movimiento_caja_id) REFERENCES movimientos_caja(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT chk_solegr_monto CHECK (monto_estimado > 0),
    INDEX idx_solegr_estado (estado),
    INDEX idx_solegr_fecha (fecha_solicitud)
) ENGINE=InnoDB;


-- --- Avisos internos entre el personal ---
CREATE TABLE avisos (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    categoria ENUM('GENERAL','LIMPIEZA','CAJA','MANTENIMIENTO','TURNO') NOT NULL DEFAULT 'GENERAL',
    asunto VARCHAR(200) NOT NULL,
    mensaje TEXT NOT NULL,
    prioridad ENUM('NORMAL','ALTA') NOT NULL DEFAULT 'NORMAL',
    autor_id BIGINT UNSIGNED NULL,
    habitacion_id BIGINT UNSIGNED NULL,
    resuelto BOOLEAN NOT NULL DEFAULT FALSE,
    fecha_hora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_avisos_autor FOREIGN KEY (autor_id) REFERENCES usuarios(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_avisos_habitacion FOREIGN KEY (habitacion_id) REFERENCES habitaciones(id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_avisos_categoria (categoria),
    INDEX idx_avisos_resuelto (resuelto),
    INDEX idx_avisos_fecha (fecha_hora)
) ENGINE=InnoDB;

CREATE TABLE avisos_leidos (
    aviso_id BIGINT UNSIGNED NOT NULL,
    usuario_id BIGINT UNSIGNED NOT NULL,
    fecha_lectura DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (aviso_id, usuario_id),
    CONSTRAINT fk_avlei_aviso FOREIGN KEY (aviso_id) REFERENCES avisos(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_avlei_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

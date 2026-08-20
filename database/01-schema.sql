-- ============================================================
-- SISTEMA DE GESTIÓN HOTELERA
-- Base de datos: hotel_management
-- Motor: MySQL 8+
-- Charset: utf8mb4
-- ============================================================

DROP DATABASE IF EXISTS hotel_management;

CREATE DATABASE hotel_management
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE hotel_management;


-- ============================================================
-- 1. ROLES
-- ============================================================

CREATE TABLE roles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;


-- ============================================================
-- 2. USUARIOS
-- ============================================================

CREATE TABLE usuarios (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,

    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,

    correo VARCHAR(150) UNIQUE,
    telefono VARCHAR(30),

    activo BOOLEAN NOT NULL DEFAULT TRUE,

    ultimo_login DATETIME NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;


-- ============================================================
-- 3. USUARIO_ROLES
-- Relación muchos a muchos entre usuarios y roles
-- ============================================================

CREATE TABLE usuario_roles (
    usuario_id BIGINT UNSIGNED NOT NULL,
    rol_id BIGINT UNSIGNED NOT NULL,

    PRIMARY KEY (usuario_id, rol_id),

    CONSTRAINT fk_usuario_roles_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_usuario_roles_rol
        FOREIGN KEY (rol_id)
        REFERENCES roles(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;


-- ============================================================
-- 4. EMPLEADOS
-- ============================================================

CREATE TABLE empleados (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    usuario_id BIGINT UNSIGNED NULL,

    tipo_documento VARCHAR(20) NOT NULL,
    numero_documento VARCHAR(30) NOT NULL UNIQUE,

    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,

    telefono VARCHAR(30),
    correo VARCHAR(150),

    cargo VARCHAR(100),

    fecha_ingreso DATE,
    fecha_salida DATE,

    activo BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_empleados_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB;


-- ============================================================
-- 5. TIPOS DE HABITACIÓN
-- ============================================================

CREATE TABLE tipos_habitacion (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    nombre VARCHAR(100) NOT NULL UNIQUE,

    descripcion TEXT,

    capacidad INT UNSIGNED NOT NULL,

    precio_noche DECIMAL(10,2) NOT NULL,

    activo BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_tipo_capacidad
        CHECK (capacidad > 0),

    CONSTRAINT chk_tipo_precio
        CHECK (precio_noche >= 0)
) ENGINE=InnoDB;


-- ============================================================
-- 6. HABITACIONES
-- ============================================================

CREATE TABLE habitaciones (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    numero VARCHAR(20) NOT NULL UNIQUE,

    piso INT NOT NULL,

    tipo_id BIGINT UNSIGNED NOT NULL,

    capacidad INT UNSIGNED NOT NULL,

    precio_noche DECIMAL(10,2) NOT NULL,

    estado ENUM(
        'DISPONIBLE',
        'RESERVADA',
        'OCUPADA',
        'LIMPIEZA',
        'MANTENIMIENTO',
        'FUERA_DE_SERVICIO'
    ) NOT NULL DEFAULT 'DISPONIBLE',

    descripcion TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_habitaciones_tipo
        FOREIGN KEY (tipo_id)
        REFERENCES tipos_habitacion(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT chk_habitacion_capacidad
        CHECK (capacidad > 0),

    CONSTRAINT chk_habitacion_precio
        CHECK (precio_noche >= 0),

    CONSTRAINT chk_habitacion_piso
        CHECK (piso >= 0)
) ENGINE=InnoDB;


-- ============================================================
-- 7. HUÉSPEDES
-- ============================================================

CREATE TABLE huespedes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    tipo_documento VARCHAR(20) NOT NULL,
    numero_documento VARCHAR(30) NOT NULL UNIQUE,

    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,

    telefono VARCHAR(30),
    correo VARCHAR(150),

    nacionalidad VARCHAR(100),
    direccion VARCHAR(255),

    fecha_nacimiento DATE,

    activo BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_huespedes_nombres (apellidos, nombres),
    INDEX idx_huespedes_documento (numero_documento)
) ENGINE=InnoDB;


-- ============================================================
-- 8. RESERVAS
-- ============================================================

CREATE TABLE reservas (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    codigo VARCHAR(30) NOT NULL UNIQUE,

    huesped_principal_id BIGINT UNSIGNED NOT NULL,

    habitacion_id BIGINT UNSIGNED NOT NULL,

    fecha_entrada DATE NOT NULL,
    fecha_salida DATE NOT NULL,

    cantidad_huespedes INT UNSIGNED NOT NULL DEFAULT 1,

    precio_noche DECIMAL(10,2) NOT NULL,

    cantidad_noches INT UNSIGNED NOT NULL,

    descuento DECIMAL(10,2) NOT NULL DEFAULT 0,

    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,

    total DECIMAL(10,2) NOT NULL DEFAULT 0,

    estado ENUM(
        'PENDIENTE',
        'CONFIRMADA',
        'CHECK_IN',
        'CHECK_OUT',
        'CANCELADA',
        'NO_SHOW'
    ) NOT NULL DEFAULT 'PENDIENTE',

    observaciones TEXT,

    created_by BIGINT UNSIGNED NULL,
    updated_by BIGINT UNSIGNED NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_reservas_huesped
        FOREIGN KEY (huesped_principal_id)
        REFERENCES huespedes(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_reservas_habitacion
        FOREIGN KEY (habitacion_id)
        REFERENCES habitaciones(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_reservas_created_by
        FOREIGN KEY (created_by)
        REFERENCES usuarios(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT fk_reservas_updated_by
        FOREIGN KEY (updated_by)
        REFERENCES usuarios(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT chk_reservas_fechas
        CHECK (fecha_salida > fecha_entrada),

    CONSTRAINT chk_reservas_huespedes
        CHECK (cantidad_huespedes > 0),

    CONSTRAINT chk_reservas_noches
        CHECK (cantidad_noches > 0),

    CONSTRAINT chk_reservas_precio
        CHECK (precio_noche >= 0),

    CONSTRAINT chk_reservas_descuento
        CHECK (descuento >= 0),

    INDEX idx_reservas_fechas (fecha_entrada, fecha_salida),
    INDEX idx_reservas_estado (estado),
    INDEX idx_reservas_codigo (codigo)
) ENGINE=InnoDB;


-- ============================================================
-- 9. RESERVA_HUESPED
-- Un huésped puede participar en varias reservas
-- Una reserva puede tener varios huéspedes
-- ============================================================

CREATE TABLE reserva_huesped (
    reserva_id BIGINT UNSIGNED NOT NULL,
    huesped_id BIGINT UNSIGNED NOT NULL,

    es_principal BOOLEAN NOT NULL DEFAULT FALSE,

    PRIMARY KEY (reserva_id, huesped_id),

    CONSTRAINT fk_reserva_huesped_reserva
        FOREIGN KEY (reserva_id)
        REFERENCES reservas(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_reserva_huesped_huesped
        FOREIGN KEY (huesped_id)
        REFERENCES huespedes(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB;


-- ============================================================
-- 10. CHECK-IN
-- ============================================================

CREATE TABLE checkins (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    reserva_id BIGINT UNSIGNED NOT NULL UNIQUE,

    huesped_id BIGINT UNSIGNED NOT NULL,

    habitacion_id BIGINT UNSIGNED NOT NULL,

    fecha_hora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    documento_verificado BOOLEAN NOT NULL DEFAULT FALSE,

    observaciones TEXT,

    usuario_id BIGINT UNSIGNED NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_checkins_reserva
        FOREIGN KEY (reserva_id)
        REFERENCES reservas(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_checkins_huesped
        FOREIGN KEY (huesped_id)
        REFERENCES huespedes(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_checkins_habitacion
        FOREIGN KEY (habitacion_id)
        REFERENCES habitaciones(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_checkins_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    INDEX idx_checkins_fecha (fecha_hora)
) ENGINE=InnoDB;


-- ============================================================
-- 11. CHECK-OUT
-- ============================================================

CREATE TABLE checkouts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    reserva_id BIGINT UNSIGNED NOT NULL UNIQUE,

    huesped_id BIGINT UNSIGNED NOT NULL,

    habitacion_id BIGINT UNSIGNED NOT NULL,

    fecha_hora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    subtotal_hospedaje DECIMAL(10,2) NOT NULL DEFAULT 0,

    subtotal_consumos DECIMAL(10,2) NOT NULL DEFAULT 0,

    subtotal_servicios DECIMAL(10,2) NOT NULL DEFAULT 0,

    descuento DECIMAL(10,2) NOT NULL DEFAULT 0,

    total DECIMAL(10,2) NOT NULL DEFAULT 0,

    observaciones TEXT,

    usuario_id BIGINT UNSIGNED NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_checkouts_reserva
        FOREIGN KEY (reserva_id)
        REFERENCES reservas(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_checkouts_huesped
        FOREIGN KEY (huesped_id)
        REFERENCES huespedes(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_checkouts_habitacion
        FOREIGN KEY (habitacion_id)
        REFERENCES habitaciones(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_checkouts_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT chk_checkouts_total
        CHECK (total >= 0),

    INDEX idx_checkouts_fecha (fecha_hora)
) ENGINE=InnoDB;


-- ============================================================
-- 12. SERVICIOS
-- ============================================================

CREATE TABLE servicios (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    nombre VARCHAR(150) NOT NULL UNIQUE,

    descripcion VARCHAR(255),

    precio DECIMAL(10,2) NOT NULL,

    activo BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_servicios_precio
        CHECK (precio >= 0)
) ENGINE=InnoDB;


-- ============================================================
-- 13. CONSUMOS
-- ============================================================

CREATE TABLE consumos (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    reserva_id BIGINT UNSIGNED NOT NULL,

    servicio_id BIGINT UNSIGNED NULL,

    descripcion VARCHAR(255) NOT NULL,

    cantidad DECIMAL(10,2) NOT NULL DEFAULT 1,

    precio_unitario DECIMAL(10,2) NOT NULL,

    subtotal DECIMAL(10,2) NOT NULL,

    fecha_hora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    usuario_id BIGINT UNSIGNED NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_consumos_reserva
        FOREIGN KEY (reserva_id)
        REFERENCES reservas(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_consumos_servicio
        FOREIGN KEY (servicio_id)
        REFERENCES servicios(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT fk_consumos_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT chk_consumos_cantidad
        CHECK (cantidad > 0),

    CONSTRAINT chk_consumos_precio
        CHECK (precio_unitario >= 0),

    CONSTRAINT chk_consumos_subtotal
        CHECK (subtotal >= 0),

    INDEX idx_consumos_reserva (reserva_id),
    INDEX idx_consumos_fecha (fecha_hora)
) ENGINE=InnoDB;


-- ============================================================
-- 14. MÉTODOS DE PAGO
-- ============================================================

CREATE TABLE metodos_pago (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    nombre VARCHAR(50) NOT NULL UNIQUE,

    descripcion VARCHAR(255),

    activo BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;


-- ============================================================
-- 15. CAJAS
-- ============================================================

CREATE TABLE cajas (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    fecha DATE NOT NULL,

    usuario_apertura_id BIGINT UNSIGNED NULL,

    usuario_cierre_id BIGINT UNSIGNED NULL,

    monto_inicial DECIMAL(10,2) NOT NULL DEFAULT 0,

    monto_final DECIMAL(10,2),

    total_ingresos DECIMAL(10,2) NOT NULL DEFAULT 0,

    total_egresos DECIMAL(10,2) NOT NULL DEFAULT 0,

    diferencia DECIMAL(10,2),

    estado ENUM(
        'ABIERTA',
        'CERRADA'
    ) NOT NULL DEFAULT 'ABIERTA',

    fecha_apertura DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    fecha_cierre DATETIME NULL,

    observaciones TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_cajas_usuario_apertura
        FOREIGN KEY (usuario_apertura_id)
        REFERENCES usuarios(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT fk_cajas_usuario_cierre
        FOREIGN KEY (usuario_cierre_id)
        REFERENCES usuarios(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT chk_cajas_monto_inicial
        CHECK (monto_inicial >= 0),

    INDEX idx_cajas_fecha (fecha),
    INDEX idx_cajas_estado (estado)
) ENGINE=InnoDB;


-- ============================================================
-- 16. PAGOS
-- ============================================================

CREATE TABLE pagos (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    reserva_id BIGINT UNSIGNED NULL,

    checkout_id BIGINT UNSIGNED NULL,

    caja_id BIGINT UNSIGNED NULL,

    metodo_pago_id BIGINT UNSIGNED NOT NULL,

    monto DECIMAL(10,2) NOT NULL,

    referencia VARCHAR(100),

    fecha_hora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    estado ENUM(
        'PENDIENTE',
        'CONFIRMADO',
        'ANULADO'
    ) NOT NULL DEFAULT 'CONFIRMADO',

    observaciones VARCHAR(255),

    usuario_id BIGINT UNSIGNED NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_pagos_reserva
        FOREIGN KEY (reserva_id)
        REFERENCES reservas(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_pagos_checkout
        FOREIGN KEY (checkout_id)
        REFERENCES checkouts(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_pagos_caja
        FOREIGN KEY (caja_id)
        REFERENCES cajas(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT fk_pagos_metodo
        FOREIGN KEY (metodo_pago_id)
        REFERENCES metodos_pago(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_pagos_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT chk_pagos_monto
        CHECK (monto > 0),

    INDEX idx_pagos_reserva (reserva_id),
    INDEX idx_pagos_fecha (fecha_hora),
    INDEX idx_pagos_estado (estado)
) ENGINE=InnoDB;


-- ============================================================
-- 17. MOVIMIENTOS DE CAJA
-- ============================================================

CREATE TABLE movimientos_caja (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    caja_id BIGINT UNSIGNED NOT NULL,

    tipo ENUM(
        'INGRESO',
        'EGRESO'
    ) NOT NULL,

    concepto VARCHAR(255) NOT NULL,

    monto DECIMAL(10,2) NOT NULL,

    pago_id BIGINT UNSIGNED NULL,

    fecha_hora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    usuario_id BIGINT UNSIGNED NULL,

    observaciones VARCHAR(255),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_movimientos_caja
        FOREIGN KEY (caja_id)
        REFERENCES cajas(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_movimientos_pago
        FOREIGN KEY (pago_id)
        REFERENCES pagos(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT fk_movimientos_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT chk_movimientos_monto
        CHECK (monto > 0),

    INDEX idx_movimientos_caja (caja_id),
    INDEX idx_movimientos_fecha (fecha_hora)
) ENGINE=InnoDB;


-- ============================================================
-- 18. LIMPIEZAS
-- ============================================================

CREATE TABLE limpiezas (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    habitacion_id BIGINT UNSIGNED NOT NULL,

    empleado_id BIGINT UNSIGNED NULL,

    fecha_hora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    estado ENUM(
        'PENDIENTE',
        'EN_PROCESO',
        'COMPLETADA',
        'OBSERVADA'
    ) NOT NULL DEFAULT 'PENDIENTE',

    observaciones TEXT,

    usuario_id BIGINT UNSIGNED NULL,

    fecha_completada DATETIME NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_limpiezas_habitacion
        FOREIGN KEY (habitacion_id)
        REFERENCES habitaciones(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_limpiezas_empleado
        FOREIGN KEY (empleado_id)
        REFERENCES empleados(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT fk_limpiezas_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    INDEX idx_limpiezas_habitacion (habitacion_id),
    INDEX idx_limpiezas_estado (estado),
    INDEX idx_limpiezas_fecha (fecha_hora)
) ENGINE=InnoDB;


-- ============================================================
-- 19. MANTENIMIENTOS
-- ============================================================

CREATE TABLE mantenimientos (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    habitacion_id BIGINT UNSIGNED NOT NULL,

    problema TEXT NOT NULL,

    prioridad ENUM(
        'BAJA',
        'MEDIA',
        'ALTA',
        'URGENTE'
    ) NOT NULL DEFAULT 'MEDIA',

    responsable_id BIGINT UNSIGNED NULL,

    estado ENUM(
        'PENDIENTE',
        'EN_PROCESO',
        'COMPLETADO',
        'CANCELADO'
    ) NOT NULL DEFAULT 'PENDIENTE',

    fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    fecha_solucion DATETIME NULL,

    solucion TEXT,

    observaciones TEXT,

    usuario_id BIGINT UNSIGNED NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_mantenimientos_habitacion
        FOREIGN KEY (habitacion_id)
        REFERENCES habitaciones(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_mantenimientos_responsable
        FOREIGN KEY (responsable_id)
        REFERENCES empleados(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT fk_mantenimientos_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    INDEX idx_mantenimientos_habitacion (habitacion_id),
    INDEX idx_mantenimientos_estado (estado),
    INDEX idx_mantenimientos_prioridad (prioridad)
) ENGINE=InnoDB;


-- ============================================================
-- 20. COMPROBANTES
-- ============================================================

CREATE TABLE comprobantes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    reserva_id BIGINT UNSIGNED NULL,

    checkout_id BIGINT UNSIGNED NULL,

    pago_id BIGINT UNSIGNED NULL,

    tipo ENUM(
        'BOLETA',
        'FACTURA',
        'RECIBO',
        'NOTA'
    ) NOT NULL,

    serie VARCHAR(20),

    numero VARCHAR(30),

    fecha_emision DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    cliente_tipo_documento VARCHAR(20),
    cliente_numero_documento VARCHAR(30),

    cliente_nombre VARCHAR(255),

    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,

    descuento DECIMAL(10,2) NOT NULL DEFAULT 0,

    impuesto DECIMAL(10,2) NOT NULL DEFAULT 0,

    total DECIMAL(10,2) NOT NULL DEFAULT 0,

    estado ENUM(
        'EMITIDO',
        'ANULADO'
    ) NOT NULL DEFAULT 'EMITIDO',

    observaciones TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_comprobantes_reserva
        FOREIGN KEY (reserva_id)
        REFERENCES reservas(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT fk_comprobantes_checkout
        FOREIGN KEY (checkout_id)
        REFERENCES checkouts(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT fk_comprobantes_pago
        FOREIGN KEY (pago_id)
        REFERENCES pagos(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT chk_comprobantes_total
        CHECK (total >= 0),

    INDEX idx_comprobantes_fecha (fecha_emision),
    INDEX idx_comprobantes_documento (serie, numero)
) ENGINE=InnoDB;


-- ============================================================
-- 21. DATOS INICIALES: ROLES
-- ============================================================

INSERT INTO roles (nombre, descripcion) VALUES
('ADMIN', 'Administrador del sistema'),
('GERENTE', 'Gerente del hotel'),
('RECEPCIONISTA', 'Personal de recepción'),
('CAJERO', 'Personal encargado de caja y pagos'),
('LIMPIEZA', 'Personal encargado de limpieza'),
('MANTENIMIENTO', 'Personal encargado de mantenimiento');


-- ============================================================
-- 22. DATOS INICIALES: MÉTODOS DE PAGO
-- ============================================================

INSERT INTO metodos_pago (nombre, descripcion) VALUES
('EFECTIVO', 'Pago en efectivo'),
('TARJETA', 'Pago mediante tarjeta'),
('YAPE', 'Pago mediante Yape'),
('PLIN', 'Pago mediante Plin'),
('TRANSFERENCIA', 'Transferencia bancaria');


-- ============================================================
-- 23. DATOS INICIALES: TIPOS DE HABITACIÓN
-- ============================================================

INSERT INTO tipos_habitacion
    (nombre, descripcion, capacidad, precio_noche)
VALUES
    ('SIMPLE', 'Habitación para una persona', 1, 0.00),
    ('DOBLE', 'Habitación para dos personas', 2, 0.00),
    ('MATRIMONIAL', 'Habitación con cama matrimonial', 2, 0.00),
    ('TRIPLE', 'Habitación para tres personas', 3, 0.00),
    ('FAMILIAR', 'Habitación para familias', 4, 0.00);


-- ============================================================
-- 24. DATOS INICIALES: SERVICIOS
-- ============================================================

INSERT INTO servicios
    (nombre, descripcion, precio)
VALUES
    ('DESAYUNO', 'Servicio de desayuno', 0.00),
    ('ALMUERZO', 'Servicio de almuerzo', 0.00),
    ('LAVANDERIA', 'Servicio de lavandería', 0.00),
    ('SERVICIO_HABITACION', 'Servicio a la habitación', 0.00),
    ('OTRO', 'Otros servicios', 0.00);


-- ============================================================
-- 25. ÍNDICES ADICIONALES
-- ============================================================

CREATE INDEX idx_habitaciones_estado
    ON habitaciones(estado);

CREATE INDEX idx_habitaciones_tipo
    ON habitaciones(tipo_id);

CREATE INDEX idx_reservas_huesped
    ON reservas(huesped_principal_id);

CREATE INDEX idx_reservas_habitacion
    ON reservas(habitacion_id);

CREATE INDEX idx_checkins_habitacion
    ON checkins(habitacion_id);

CREATE INDEX idx_checkouts_habitacion
    ON checkouts(habitacion_id);

CREATE INDEX idx_pagos_metodo
    ON pagos(metodo_pago_id);


-- ============================================================
-- FIN DEL SCHEMA
-- ============================================================

SELECT 'Base de datos hotel_management creada correctamente.' AS mensaje;

-- ============================================================
-- 26. COLUMNAS NUBEFACT (facturación electrónica SUNAT)
-- Guardan la respuesta de Nubefact al emitir un comprobante.
-- ============================================================

ALTER TABLE comprobantes
  ADD COLUMN sunat_aceptada BOOLEAN NULL AFTER estado,
  ADD COLUMN sunat_descripcion VARCHAR(500) NULL AFTER sunat_aceptada,
  ADD COLUMN sunat_enlace_pdf VARCHAR(500) NULL AFTER sunat_descripcion,
  ADD COLUMN sunat_enlace_xml VARCHAR(500) NULL AFTER sunat_enlace_pdf,
  ADD COLUMN sunat_enlace_cdr VARCHAR(500) NULL AFTER sunat_enlace_xml,
  ADD COLUMN sunat_codigo_hash VARCHAR(255) NULL AFTER sunat_enlace_cdr,
  ADD COLUMN sunat_respuesta_json TEXT NULL AFTER sunat_codigo_hash;


-- ============================================================
-- 27. CONTROL DE HOSPEDADOS, CAJA CHICA Y AVISOS
-- Hora límite de salida y cargo por día extra; solicitudes de
-- egreso con aprobación; avisos internos del personal.
-- ============================================================

ALTER TABLE reservas
  ADD COLUMN hora_limite_salida TIME NOT NULL DEFAULT '13:00:00' AFTER fecha_salida,
  ADD COLUMN dias_extra INT UNSIGNED NOT NULL DEFAULT 0 AFTER cantidad_noches,
  ADD COLUMN cargo_extra DECIMAL(10,2) NOT NULL DEFAULT 0 AFTER dias_extra;

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

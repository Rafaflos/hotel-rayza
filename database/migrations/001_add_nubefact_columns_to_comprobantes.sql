-- ============================================================
-- Agrega columnas para guardar la respuesta de Nubefact (SUNAT)
-- al emitir un comprobante electrónico.
-- Aplicado manualmente el 2026-08-18.
-- ============================================================

ALTER TABLE comprobantes
  ADD COLUMN sunat_aceptada BOOLEAN NULL AFTER estado,
  ADD COLUMN sunat_descripcion VARCHAR(500) NULL AFTER sunat_aceptada,
  ADD COLUMN sunat_enlace_pdf VARCHAR(500) NULL AFTER sunat_descripcion,
  ADD COLUMN sunat_enlace_xml VARCHAR(500) NULL AFTER sunat_enlace_pdf,
  ADD COLUMN sunat_enlace_cdr VARCHAR(500) NULL AFTER sunat_enlace_xml,
  ADD COLUMN sunat_codigo_hash VARCHAR(255) NULL AFTER sunat_enlace_cdr,
  ADD COLUMN sunat_respuesta_json TEXT NULL AFTER sunat_codigo_hash;

import type { Tone } from '../components/ui/Badge'
import type {
  EstadoCaja,
  EstadoComprobante,
  EstadoHabitacion,
  EstadoLimpieza,
  EstadoMantenimiento,
  EstadoReserva,
  Prioridad,
} from '../types'

export const estadoHabitacionInfo: Record<EstadoHabitacion, { label: string; tone: Tone }> = {
  DISPONIBLE: { label: 'Disponible', tone: 'success' },
  RESERVADA: { label: 'Reservada', tone: 'info' },
  OCUPADA: { label: 'Ocupada', tone: 'warning' },
  LIMPIEZA: { label: 'Limpieza', tone: 'neutral' },
  MANTENIMIENTO: { label: 'Mantenimiento', tone: 'danger' },
  FUERA_DE_SERVICIO: { label: 'Fuera de servicio', tone: 'danger' },
}

export const estadoReservaInfo: Record<EstadoReserva, { label: string; tone: Tone }> = {
  PENDIENTE: { label: 'Pendiente', tone: 'warning' },
  CONFIRMADA: { label: 'Confirmada', tone: 'info' },
  CHECK_IN: { label: 'Check-in', tone: 'success' },
  CHECK_OUT: { label: 'Check-out', tone: 'neutral' },
  CANCELADA: { label: 'Cancelada', tone: 'danger' },
  NO_SHOW: { label: 'No show', tone: 'danger' },
}

export const estadoCajaInfo: Record<EstadoCaja, { label: string; tone: Tone }> = {
  ABIERTA: { label: 'Abierta', tone: 'success' },
  CERRADA: { label: 'Cerrada', tone: 'neutral' },
}

export const estadoLimpiezaInfo: Record<EstadoLimpieza, { label: string; tone: Tone }> = {
  PENDIENTE: { label: 'Pendiente', tone: 'warning' },
  EN_PROCESO: { label: 'En proceso', tone: 'info' },
  COMPLETADA: { label: 'Completada', tone: 'success' },
  OBSERVADA: { label: 'Observada', tone: 'danger' },
}

export const estadoMantenimientoInfo: Record<EstadoMantenimiento, { label: string; tone: Tone }> = {
  PENDIENTE: { label: 'Pendiente', tone: 'warning' },
  EN_PROCESO: { label: 'En proceso', tone: 'info' },
  COMPLETADO: { label: 'Completado', tone: 'success' },
  CANCELADO: { label: 'Cancelado', tone: 'neutral' },
}

export const prioridadInfo: Record<Prioridad, { label: string; tone: Tone }> = {
  BAJA: { label: 'Baja', tone: 'neutral' },
  MEDIA: { label: 'Media', tone: 'info' },
  ALTA: { label: 'Alta', tone: 'warning' },
  URGENTE: { label: 'Urgente', tone: 'danger' },
}

export const estadoComprobanteInfo: Record<EstadoComprobante, { label: string; tone: Tone }> = {
  EMITIDO: { label: 'Emitido', tone: 'success' },
  ANULADO: { label: 'Anulado', tone: 'danger' },
}

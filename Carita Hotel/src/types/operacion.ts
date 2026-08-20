/** Tipos de las funciones operativas: estancias, caja chica y avisos internos. */

export interface Estancia {
  reservaId: number
  codigo: string
  habitacionNumero: string
  huespedNombre: string
  huespedDocumento: string
  fechaEntrada: string
  fechaSalida: string
  horaLimiteSalida: string
  diasTranscurridos: number
  diasExtra: number
  cargoExtra: number
  totalHospedaje: number
  totalConsumos: number
  totalCuenta: number
  totalPagado: number
  saldoPendiente: number
  vencida: boolean
  estadoOperativo: string
}

export type EstadoSolicitudEgreso = 'PENDIENTE' | 'APROBADA' | 'RECHAZADA' | 'LIQUIDADA'

export interface SolicitudEgreso {
  id: number
  concepto: string
  montoEstimado: number
  montoReal?: number
  estado: EstadoSolicitudEgreso
  comprobanteReferencia?: string
  observaciones?: string
  solicitante?: string
  aprobador?: string
  fechaSolicitud: string
  fechaResolucion?: string
  fechaLiquidacion?: string
}

export type CategoriaAviso = 'GENERAL' | 'LIMPIEZA' | 'CAJA' | 'MANTENIMIENTO' | 'TURNO'
export type PrioridadAviso = 'NORMAL' | 'ALTA'

export interface Aviso {
  id: number
  categoria: CategoriaAviso
  asunto: string
  mensaje: string
  prioridad: PrioridadAviso
  autor?: string
  habitacionNumero?: string
  resuelto: boolean
  leido: boolean
  fechaHora: string
}

export interface AvisoInput {
  categoria: CategoriaAviso
  asunto: string
  mensaje: string
  prioridad: PrioridadAviso
  habitacionId?: number
}

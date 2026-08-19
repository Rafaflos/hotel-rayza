export type EstadoHabitacion =
  | 'DISPONIBLE'
  | 'RESERVADA'
  | 'OCUPADA'
  | 'LIMPIEZA'
  | 'MANTENIMIENTO'
  | 'FUERA_DE_SERVICIO'

export type EstadoReserva =
  | 'PENDIENTE'
  | 'CONFIRMADA'
  | 'CHECK_IN'
  | 'CHECK_OUT'
  | 'CANCELADA'
  | 'NO_SHOW'

export interface TipoHabitacion {
  id: number
  nombre: string
  descripcion?: string
  capacidad: number
  precioNoche: number
  activo: boolean
}

export interface TipoHabitacionInput {
  nombre: string
  descripcion?: string
  capacidad: number
  precioNoche: number
}

export interface Habitacion {
  id: number
  numero: string
  piso: number
  tipo: TipoHabitacion
  capacidad: number
  precioNoche: number
  estado: EstadoHabitacion
  descripcion?: string
}

export interface HabitacionInput {
  numero: string
  piso: number
  tipoId: number
  capacidad: number
  precioNoche: number
  estado?: EstadoHabitacion
  descripcion?: string
}

export interface Huesped {
  id: number
  tipoDocumento: string
  numeroDocumento: string
  nombres: string
  apellidos: string
  telefono?: string
  correo?: string
  nacionalidad?: string
  direccion?: string
  fechaNacimiento?: string
}

export type HuespedInput = Omit<Huesped, 'id'>

export interface Reserva {
  id: number
  codigo: string
  huespedPrincipal: Huesped
  habitacion: Habitacion
  fechaEntrada: string
  fechaSalida: string
  cantidadHuespedes: number
  precioNoche: number
  cantidadNoches: number
  descuento: number
  subtotal: number
  total: number
  estado: EstadoReserva
  observaciones?: string
}

export interface ReservaInput {
  huespedPrincipalId: number
  habitacionId: number
  fechaEntrada: string
  fechaSalida: string
  cantidadHuespedes: number
  descuento?: number
  observaciones?: string
}

export interface Checkin {
  id: number
  reservaId: number
  reservaCodigo: string
  huesped: Huesped
  habitacion: Habitacion
  fechaHora: string
  documentoVerificado: boolean
  observaciones?: string
}

export interface CheckinInput {
  reservaId: number
  documentoVerificado: boolean
  observaciones?: string
}

export interface Checkout {
  id: number
  reservaId: number
  reservaCodigo: string
  huesped: Huesped
  habitacion: Habitacion
  fechaHora: string
  subtotalHospedaje: number
  subtotalConsumos: number
  subtotalServicios: number
  descuento: number
  total: number
  observaciones?: string
}

export interface CheckoutInput {
  reservaId: number
  descuento?: number
  observaciones?: string
}

export type EstadoPago = 'PENDIENTE' | 'CONFIRMADO' | 'ANULADO'

export interface MetodoPago {
  id: number
  nombre: string
  descripcion?: string
}

export interface Pago {
  id: number
  reservaId?: number
  reservaCodigo?: string
  checkoutId?: number
  metodoPago: string
  monto: number
  referencia?: string
  fechaHora: string
  estado: EstadoPago
  observaciones?: string
}

export interface PagoInput {
  reservaId?: number
  checkoutId?: number
  metodoPagoId: number
  monto: number
  referencia?: string
  observaciones?: string
}

export type EstadoCaja = 'ABIERTA' | 'CERRADA'

export interface Caja {
  id: number
  fecha: string
  usuarioApertura?: string
  usuarioCierre?: string
  montoInicial: number
  montoFinal?: number
  totalIngresos: number
  totalEgresos: number
  diferencia?: number
  estado: EstadoCaja
  fechaApertura: string
  fechaCierre?: string
  observaciones?: string
}

export type TipoMovimiento = 'INGRESO' | 'EGRESO'

export interface MovimientoCaja {
  id: number
  tipo: TipoMovimiento
  concepto: string
  monto: number
  pagoId?: number
  fechaHora: string
  observaciones?: string
}

export interface DashboardResumen {
  habitacionesDisponibles: number
  habitacionesOcupadas: number
  habitacionesReservadas: number
  habitacionesLimpieza: number
  habitacionesMantenimiento: number
  reservasHoy: number
  checkinsHoy: number
  checkoutsHoy: number
  ingresosHoy: number
}

export interface Servicio {
  id: number
  nombre: string
  descripcion?: string
  precio: number
}

export interface Consumo {
  id: number
  reservaId: number
  servicioNombre?: string
  descripcion: string
  cantidad: number
  precioUnitario: number
  subtotal: number
  fechaHora: string
}

export interface ConsumoInput {
  reservaId: number
  servicioId?: number
  descripcion: string
  cantidad: number
  precioUnitario: number
}

export type EstadoLimpieza = 'PENDIENTE' | 'EN_PROCESO' | 'COMPLETADA' | 'OBSERVADA'

export interface Limpieza {
  id: number
  habitacion: Habitacion
  fechaHora: string
  estado: EstadoLimpieza
  empleadoId?: number
  empleadoNombre?: string
  observaciones?: string
  fechaCompletada?: string
}

export interface LimpiezaInput {
  habitacionId: number
  empleadoId?: number
  observaciones?: string
}

export type Prioridad = 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE'
export type EstadoMantenimiento = 'PENDIENTE' | 'EN_PROCESO' | 'COMPLETADO' | 'CANCELADO'

export interface Mantenimiento {
  id: number
  habitacion: Habitacion
  problema: string
  prioridad: Prioridad
  estado: EstadoMantenimiento
  responsableId?: number
  responsableNombre?: string
  fecha: string
  fechaSolucion?: string
  solucion?: string
  observaciones?: string
}

export interface MantenimientoInput {
  habitacionId: number
  problema: string
  prioridad?: Prioridad
  responsableId?: number
  observaciones?: string
}

export interface ReporteResumen {
  desde: string
  hasta: string
  totalHabitaciones: number
  habitacionesOcupadasActual: number
  totalReservas: number
  reservasPorEstado: Record<string, number>
  cancelaciones: number
  checkins: number
  checkouts: number
  ingresosTotal: number
  ingresosPorMetodo: Record<string, number>
  cajas: Caja[]
}

export type TipoComprobante = 'BOLETA' | 'FACTURA' | 'RECIBO' | 'NOTA'
export type EstadoComprobante = 'EMITIDO' | 'ANULADO'

export interface Comprobante {
  id: number
  tipo: TipoComprobante
  serie: string
  numero: string
  fechaEmision: string
  clienteTipoDocumento?: string
  clienteNumeroDocumento?: string
  clienteNombre?: string
  reservaCodigo?: string
  habitacionNumero?: string
  subtotal: number
  descuento: number
  impuesto: number
  total: number
  estado: EstadoComprobante
  observaciones?: string
  sunatAceptada?: boolean
  sunatDescripcion?: string
  sunatEnlacePdf?: string
}

export interface ComprobanteInput {
  checkoutId: number
  tipo: TipoComprobante
  observaciones?: string
}

export interface ApiError {
  timestamp: string
  status: number
  error: string
  message: string
  fieldErrors?: Record<string, string>
}

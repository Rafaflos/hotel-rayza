import { api } from './api'
import type { MetodoPago, Pago, PagoInput } from '../types'

export const pagosService = {
  byReserva: (reservaId: number) => api.get<Pago[]>('/pagos', { params: { reservaId } }).then((r) => r.data),
  create: (input: PagoInput) => api.post<Pago>('/pagos', input).then((r) => r.data),
  metodos: () => api.get<MetodoPago[]>('/metodos-pago').then((r) => r.data),
}

import { api } from './api'
import type { Checkout, Comprobante, ComprobanteInput } from '../types'

export const comprobantesService = {
  list: () => api.get<Comprobante[]>('/comprobantes').then((r) => r.data),
  create: (input: ComprobanteInput) => api.post<Comprobante>('/comprobantes', input).then((r) => r.data),
  anular: (id: number, motivo: string) =>
    api.post<Comprobante>(`/comprobantes/${id}/anular`, { motivo }).then((r) => r.data),
  checkoutByReserva: (reservaId: number) =>
    api.get<Checkout>(`/checkouts/reserva/${reservaId}`).then((r) => r.data),
}

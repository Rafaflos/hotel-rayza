import { api } from './api'
import type { Caja, MovimientoCaja } from '../types'

export const cajasService = {
  abierta: () => api.get<Caja>('/cajas/abierta').then((r) => r.data),
  movimientos: (cajaId: number) => api.get<MovimientoCaja[]>(`/cajas/${cajaId}/movimientos`).then((r) => r.data),
  abrir: (montoInicial: number, observaciones?: string) =>
    api.post<Caja>('/cajas/abrir', { montoInicial, observaciones }).then((r) => r.data),
  cerrar: (id: number, montoContado: number, observaciones?: string) =>
    api.post<Caja>(`/cajas/${id}/cerrar`, { montoContado, observaciones }).then((r) => r.data),
}

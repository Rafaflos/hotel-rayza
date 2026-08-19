import { api } from './api'
import type { Limpieza, LimpiezaInput } from '../types'

export const limpiezasService = {
  pendientes: () => api.get<Limpieza[]>('/limpiezas').then((r) => r.data),
  todas: () => api.get<Limpieza[]>('/limpiezas', { params: { todas: true } }).then((r) => r.data),
  create: (input: LimpiezaInput) => api.post<Limpieza>('/limpiezas', input).then((r) => r.data),
  iniciar: (id: number) => api.post<Limpieza>(`/limpiezas/${id}/iniciar`).then((r) => r.data),
  completar: (id: number) => api.post<Limpieza>(`/limpiezas/${id}/completar`).then((r) => r.data),
  observar: (id: number, observaciones?: string) =>
    api.post<Limpieza>(`/limpiezas/${id}/observar`, { observaciones }).then((r) => r.data),
}

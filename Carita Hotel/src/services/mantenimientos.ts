import { api } from './api'
import type { Mantenimiento, MantenimientoInput } from '../types'

export const mantenimientosService = {
  pendientes: () => api.get<Mantenimiento[]>('/mantenimientos').then((r) => r.data),
  todos: () => api.get<Mantenimiento[]>('/mantenimientos', { params: { todas: true } }).then((r) => r.data),
  create: (input: MantenimientoInput) => api.post<Mantenimiento>('/mantenimientos', input).then((r) => r.data),
  iniciar: (id: number) => api.post<Mantenimiento>(`/mantenimientos/${id}/iniciar`).then((r) => r.data),
  completar: (id: number, solucion: string) =>
    api.post<Mantenimiento>(`/mantenimientos/${id}/completar`, { solucion }).then((r) => r.data),
  cancelar: (id: number) => api.post<Mantenimiento>(`/mantenimientos/${id}/cancelar`).then((r) => r.data),
}

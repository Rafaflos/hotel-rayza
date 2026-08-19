import { api } from './api'
import type { EstadoReserva, Reserva, ReservaInput } from '../types'

export const reservasService = {
  list: (estado?: EstadoReserva) =>
    api.get<Reserva[]>('/reservas', { params: estado ? { estado } : undefined }).then((r) => r.data),
  get: (id: number) => api.get<Reserva>(`/reservas/${id}`).then((r) => r.data),
  create: (input: ReservaInput) => api.post<Reserva>('/reservas', input).then((r) => r.data),
  confirmar: (id: number) => api.post<Reserva>(`/reservas/${id}/confirmar`).then((r) => r.data),
  cancelar: (id: number) => api.post<Reserva>(`/reservas/${id}/cancelar`).then((r) => r.data),
}

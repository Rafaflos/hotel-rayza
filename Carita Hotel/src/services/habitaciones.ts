import { api } from './api'
import type { Habitacion, HabitacionInput } from '../types'

export const habitacionesService = {
  list: () => api.get<Habitacion[]>('/habitaciones').then((r) => r.data),
  get: (id: number) => api.get<Habitacion>(`/habitaciones/${id}`).then((r) => r.data),
  create: (input: HabitacionInput) => api.post<Habitacion>('/habitaciones', input).then((r) => r.data),
  update: (id: number, input: HabitacionInput) =>
    api.put<Habitacion>(`/habitaciones/${id}`, input).then((r) => r.data),
  remove: (id: number) => api.delete(`/habitaciones/${id}`),
}

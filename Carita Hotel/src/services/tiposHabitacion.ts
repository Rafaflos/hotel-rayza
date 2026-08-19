import { api } from './api'
import type { TipoHabitacion, TipoHabitacionInput } from '../types'

export const tiposHabitacionService = {
  list: () => api.get<TipoHabitacion[]>('/tipos-habitacion').then((r) => r.data),
  create: (input: TipoHabitacionInput) =>
    api.post<TipoHabitacion>('/tipos-habitacion', input).then((r) => r.data),
}

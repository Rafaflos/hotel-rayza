import { api } from './api'
import type { Consumo, ConsumoInput, Servicio } from '../types'

export const consumosService = {
  byReserva: (reservaId: number) => api.get<Consumo[]>('/consumos', { params: { reservaId } }).then((r) => r.data),
  create: (input: ConsumoInput) => api.post<Consumo>('/consumos', input).then((r) => r.data),
  servicios: () => api.get<Servicio[]>('/servicios').then((r) => r.data),
}

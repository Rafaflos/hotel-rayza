import { api } from './api'
import type { Checkin, CheckinInput } from '../types'

export const checkinsService = {
  create: (input: CheckinInput) => api.post<Checkin>('/checkins', input).then((r) => r.data),
  byReserva: (reservaId: number) => api.get<Checkin>(`/checkins/reserva/${reservaId}`).then((r) => r.data),
}

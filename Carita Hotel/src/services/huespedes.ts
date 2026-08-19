import { api } from './api'
import type { Huesped, HuespedInput } from '../types'

export const huespedesService = {
  list: (q?: string) => api.get<Huesped[]>('/huespedes', { params: q ? { q } : undefined }).then((r) => r.data),
  get: (id: number) => api.get<Huesped>(`/huespedes/${id}`).then((r) => r.data),
  create: (input: HuespedInput) => api.post<Huesped>('/huespedes', input).then((r) => r.data),
  update: (id: number, input: HuespedInput) => api.put<Huesped>(`/huespedes/${id}`, input).then((r) => r.data),
  remove: (id: number) => api.delete(`/huespedes/${id}`),
}

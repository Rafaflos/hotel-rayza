import { api } from './api'
import type { Empleado, EmpleadoInput } from '../types/empleado'

export const empleadosService = {
  list: () => api.get<Empleado[]>('/empleados').then((r) => r.data),
  activos: () => api.get<Empleado[]>('/empleados', { params: { soloActivos: true } }).then((r) => r.data),
  create: (input: EmpleadoInput) => api.post<Empleado>('/empleados', input).then((r) => r.data),
  update: (id: number, input: EmpleadoInput) => api.put<Empleado>(`/empleados/${id}`, input).then((r) => r.data),
  desactivar: (id: number) => api.delete(`/empleados/${id}`),
}

import { api } from './api'
import type { Rol, Usuario, UsuarioInput } from '../types/usuario'

export const usuariosService = {
  list: () => api.get<Usuario[]>('/usuarios').then((r) => r.data),
  roles: () => api.get<Rol[]>('/usuarios/roles').then((r) => r.data),
  create: (input: UsuarioInput) => api.post<Usuario>('/usuarios', input).then((r) => r.data),
  update: (id: number, input: UsuarioInput) => api.put<Usuario>(`/usuarios/${id}`, input).then((r) => r.data),
  desactivar: (id: number) => api.delete(`/usuarios/${id}`),
}

export const authService = {
  changePassword: (currentPassword: string, newPassword: string) =>
    api.post('/auth/change-password', { currentPassword, newPassword }),
}

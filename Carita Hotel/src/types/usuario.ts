export interface Rol {
  id: number
  nombre: string
  descripcion?: string
}

export interface Usuario {
  id: number
  username: string
  nombres: string
  apellidos: string
  correo?: string
  telefono?: string
  activo: boolean
  ultimoLogin?: string
  roles: { id: number; nombre: string }[]
}

export interface UsuarioInput {
  username: string
  password?: string
  nombres: string
  apellidos: string
  correo?: string
  telefono?: string
  activo?: boolean
  rolesIds: number[]
}

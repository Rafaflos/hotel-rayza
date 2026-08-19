export interface Empleado {
  id: number
  tipoDocumento: string
  numeroDocumento: string
  nombres: string
  apellidos: string
  telefono?: string
  correo?: string
  cargo?: string
  fechaIngreso?: string
  activo: boolean
}

export type EmpleadoInput = Omit<Empleado, 'id'>

// Qué roles pueden ver cada módulo. ADMIN y GERENTE ven todo.
// Un módulo sin `roles` es visible para cualquier usuario autenticado.
export interface Modulo {
  to: string
  label: string
  roles?: string[]
}

const TODOS_OPERATIVOS = ['ADMIN', 'GERENTE', 'RECEPCIONISTA']

export const modulos: Modulo[] = [
  { to: '/', label: 'Dashboard' },
  { to: '/habitaciones', label: 'Habitaciones', roles: TODOS_OPERATIVOS },
  { to: '/huespedes', label: 'Huéspedes', roles: TODOS_OPERATIVOS },
  { to: '/reservas', label: 'Reservas', roles: TODOS_OPERATIVOS },
  { to: '/checkin', label: 'Check-in', roles: TODOS_OPERATIVOS },
  { to: '/checkout', label: 'Check-out', roles: TODOS_OPERATIVOS },
  { to: '/consumos', label: 'Consumos', roles: TODOS_OPERATIVOS },
  { to: '/pagos', label: 'Pagos', roles: ['ADMIN', 'GERENTE', 'CAJERO'] },
  { to: '/caja', label: 'Caja', roles: ['ADMIN', 'GERENTE', 'CAJERO'] },
  { to: '/comprobantes', label: 'Comprobantes', roles: ['ADMIN', 'GERENTE', 'CAJERO'] },
  { to: '/limpieza', label: 'Limpieza', roles: ['ADMIN', 'GERENTE', 'LIMPIEZA'] },
  { to: '/mantenimiento', label: 'Mantenimiento', roles: ['ADMIN', 'GERENTE', 'MANTENIMIENTO'] },
  { to: '/reportes', label: 'Reportes', roles: ['ADMIN', 'GERENTE'] },
  { to: '/empleados', label: 'Empleados', roles: ['ADMIN', 'GERENTE'] },
  { to: '/usuarios', label: 'Usuarios', roles: ['ADMIN'] },
]

export function puedeVer(modulo: Modulo, roles: string[]): boolean {
  if (!modulo.roles) return true
  return modulo.roles.some((r) => roles.includes(r))
}

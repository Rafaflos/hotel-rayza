import type { ComponentType, SVGProps } from 'react'
import {
  IconAvisos,
  IconCaja,
  IconCheckIn,
  IconCheckOut,
  IconComprobantes,
  IconConsumos,
  IconDashboard,
  IconEgresos,
  IconEmpleados,
  IconHospedados,
  IconHabitaciones,
  IconHuespedes,
  IconLimpieza,
  IconMantenimiento,
  IconPagos,
  IconReportes,
  IconReservas,
  IconUsuarios,
} from '../components/ui/icons'

/** Qué indicador en vivo se muestra junto al módulo en la barra lateral. */
export type Indicador = 'vencidas' | 'avisos' | 'egresos'

export interface Modulo {
  to: string
  label: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  roles?: string[]
  indicador?: Indicador
}

export interface GrupoModulos {
  titulo: string
  modulos: Modulo[]
}

const OPERATIVOS = ['ADMIN', 'GERENTE', 'RECEPCIONISTA']
const CAJA = ['ADMIN', 'GERENTE', 'CAJERO']

/**
 * Agrupados por la tarea que resuelven, no por orden de construcción: el
 * personal busca "lo del dinero" o "lo del cuarto", no una lista alfabética.
 */
export const grupos: GrupoModulos[] = [
  {
    titulo: 'Operación',
    modulos: [
      { to: '/', label: 'Panel', icon: IconDashboard },
      { to: '/hospedados', label: 'Hospedados', icon: IconHospedados, roles: OPERATIVOS, indicador: 'vencidas' },
      { to: '/reservas', label: 'Reservas', icon: IconReservas, roles: OPERATIVOS },
      { to: '/checkin', label: 'Check-in', icon: IconCheckIn, roles: OPERATIVOS },
      { to: '/checkout', label: 'Check-out', icon: IconCheckOut, roles: OPERATIVOS },
      { to: '/habitaciones', label: 'Habitaciones', icon: IconHabitaciones, roles: OPERATIVOS },
      { to: '/huespedes', label: 'Huéspedes', icon: IconHuespedes, roles: OPERATIVOS },
      { to: '/consumos', label: 'Consumos', icon: IconConsumos, roles: OPERATIVOS },
    ],
  },
  {
    titulo: 'Finanzas',
    modulos: [
      { to: '/caja', label: 'Caja', icon: IconCaja, roles: CAJA },
      { to: '/pagos', label: 'Pagos', icon: IconPagos, roles: CAJA },
      { to: '/egresos', label: 'Egresos', icon: IconEgresos, roles: CAJA, indicador: 'egresos' },
      { to: '/comprobantes', label: 'Comprobantes', icon: IconComprobantes, roles: CAJA },
    ],
  },
  {
    titulo: 'Servicio',
    modulos: [
      { to: '/limpieza', label: 'Limpieza', icon: IconLimpieza, roles: ['ADMIN', 'GERENTE', 'LIMPIEZA'] },
      {
        to: '/mantenimiento',
        label: 'Mantenimiento',
        icon: IconMantenimiento,
        roles: ['ADMIN', 'GERENTE', 'MANTENIMIENTO'],
      },
      { to: '/avisos', label: 'Avisos', icon: IconAvisos, indicador: 'avisos' },
    ],
  },
  {
    titulo: 'Administración',
    modulos: [
      { to: '/reportes', label: 'Reportes', icon: IconReportes, roles: ['ADMIN', 'GERENTE'] },
      { to: '/empleados', label: 'Empleados', icon: IconEmpleados, roles: ['ADMIN', 'GERENTE'] },
      { to: '/usuarios', label: 'Usuarios', icon: IconUsuarios, roles: ['ADMIN'] },
    ],
  },
]

export function puedeVer(modulo: Modulo, roles: string[]): boolean {
  if (!modulo.roles) return true
  return modulo.roles.some((r) => roles.includes(r))
}

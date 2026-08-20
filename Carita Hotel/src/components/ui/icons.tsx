import type { SVGProps } from 'react'

/**
 * Set de iconos propio: un solo grosor de trazo (1.75) y una sola caja (24×24)
 * para que toda la interfaz tenga la misma voz gráfica.
 */
type IconProps = SVGProps<SVGSVGElement>

function Icon({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  )
}

export const IconDashboard = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 13h6V4H4zM14 9h6V4h-6zM14 20h6v-7h-6zM4 20h6v-4H4z" />
  </Icon>
)

export const IconEstancias = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 18v-9M3 13h18v5M21 18v-3" />
    <path d="M7 13V9.5A1.5 1.5 0 0 1 8.5 8h9a3.5 3.5 0 0 1 3.5 3.5V13" />
    <circle cx="7.5" cy="10.5" r="1.6" />
  </Icon>
)

export const IconHabitaciones = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M3 21h18" />
    <circle cx="14" cy="12" r="1" fill="currentColor" stroke="none" />
  </Icon>
)

export const IconHuespedes = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3 20a6 6 0 0 1 12 0" />
    <path d="M16 11.2A3 3 0 0 0 16 5.3M18.5 20a5.6 5.6 0 0 0-2.7-4.8" />
  </Icon>
)

export const IconReservas = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
    <path d="M8.5 14.5h3" />
  </Icon>
)

export const IconCheckIn = (p: IconProps) => (
  <Icon {...p}>
    <path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" />
    <path d="M10 8l4 4-4 4M14 12H3" />
  </Icon>
)

export const IconCheckOut = (p: IconProps) => (
  <Icon {...p}>
    <path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4" />
    <path d="M17 8l4 4-4 4M21 12H10" />
  </Icon>
)

export const IconConsumos = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </Icon>
)

export const IconPagos = (p: IconProps) => (
  <Icon {...p}>
    <rect x="2.5" y="5.5" width="19" height="13" rx="2.5" />
    <path d="M2.5 10h19M6.5 14.5h3" />
  </Icon>
)

export const IconCaja = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 8.5A2.5 2.5 0 0 1 5.5 6h13A2.5 2.5 0 0 1 21 8.5v9a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5z" />
    <path d="M3 10h18M16.5 14.5h2" />
    <path d="M6.5 6l2-2h7l2 2" />
  </Icon>
)

export const IconComprobantes = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 3h8l4 4v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
    <path d="M14 3v4h4M8.5 12h7M8.5 16h4" />
  </Icon>
)

export const IconLimpieza = (p: IconProps) => (
  <Icon {...p}>
    <path d="M8 14l6-9 3.5 2.2-5.2 8.6z" />
    <path d="M6.5 15.5 4 21h13l-2.2-4.4" />
    <path d="M10.5 17.5v2M13.5 17.5v2" />
  </Icon>
)

export const IconMantenimiento = (p: IconProps) => (
  <Icon {...p}>
    <path d="M14.7 6.3a4.5 4.5 0 0 0 5.9 5.9l-8.4 8.4a2.1 2.1 0 0 1-3-3z" />
    <path d="M14.7 6.3 17.8 3.2" />
  </Icon>
)

export const IconReportes = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 20h16M7 20V11M12 20V5M17 20v-6" />
  </Icon>
)

export const IconEmpleados = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3" y="4.5" width="18" height="15" rx="2" />
    <circle cx="9" cy="11" r="2.2" />
    <path d="M5.6 16.5a3.8 3.8 0 0 1 6.8 0M14.5 10h4M14.5 13.5h3" />
  </Icon>
)

export const IconUsuarios = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3l7.5 3v5.4c0 4.4-3 8.2-7.5 9.6-4.5-1.4-7.5-5.2-7.5-9.6V6z" />
    <path d="M9.2 12.2l2 2 3.6-3.9" />
  </Icon>
)

export const IconEgresos = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.8v8.4M9 13.2l3 3 3-3" />
  </Icon>
)

export const IconAvisos = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3.5a5.5 5.5 0 0 1 5.5 5.5c0 4 1.5 5.5 2 6.2.2.3 0 .8-.5.8H5c-.5 0-.7-.5-.5-.8.5-.7 2-2.2 2-6.2A5.5 5.5 0 0 1 12 3.5z" />
    <path d="M10 19.2a2.2 2.2 0 0 0 4 0" />
  </Icon>
)

export const IconClose = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Icon>
)

export const IconSun = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
  </Icon>
)

export const IconMoon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M20 14.2A8.2 8.2 0 0 1 9.8 4a8.5 8.5 0 1 0 10.2 10.2z" />
  </Icon>
)

export const IconAlert = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 4.8 2.9 20h18.2z" />
    <path d="M12 10v4.2M12 17.2v.1" />
  </Icon>
)

export const IconCheck = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4.5 12.5l5 5 10-11" />
  </Icon>
)

export const IconPlus = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
)

export const IconSearch = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M15.8 15.8 21 21" />
  </Icon>
)

export const IconLogout = (p: IconProps) => (
  <Icon {...p}>
    <path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4" />
    <path d="M16 8l4 4-4 4M20 12H9" />
  </Icon>
)

export const IconKey = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="8" cy="14" r="4" />
    <path d="M11 11.2 19 3.5M16.5 6l2.2 2.2M14.6 7.9l1.9 1.9" />
  </Icon>
)

export const IconClock = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </Icon>
)

export const IconChevron = (p: IconProps) => (
  <Icon {...p}>
    <path d="M9 5l7 7-7 7" />
  </Icon>
)

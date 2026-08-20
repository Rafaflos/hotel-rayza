import type { ReactNode, ThHTMLAttributes, TdHTMLAttributes } from 'react'

/** Contenedor con borde propio: la elevación se declara una sola vez, con borde. */
export function TableCard({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface">
      <div className="overflow-x-auto">{children}</div>
    </div>
  )
}

export function Table({ children }: { children: ReactNode }) {
  return <table className="w-full border-collapse text-left text-sm">{children}</table>
}

export function THead({ children }: { children: ReactNode }) {
  return (
    <thead className="border-b border-line bg-canvas/70">
      <tr>{children}</tr>
    </thead>
  )
}

export function TH({ className = '', children, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={`px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.055em] text-ink-3 ${className}`}
      {...props}
    >
      {children}
    </th>
  )
}

export function TBody({ children }: { children: ReactNode }) {
  return <tbody className="divide-y divide-line">{children}</tbody>
}

export function TR({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <tr className={`transition-colors duration-100 hover:bg-canvas/60 ${className}`}>{children}</tr>
}

export function TD({ className = '', children, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={`px-4 py-3 text-ink-2 ${className}`} {...props}>
      {children}
    </td>
  )
}

/** Celda principal de la fila (el dato que identifica el registro). */
export function TDKey({ className = '', children, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={`px-4 py-3 font-medium text-ink ${className}`} {...props}>
      {children}
    </td>
  )
}

/** Montos y cantidades: cifras de ancho fijo alineadas a la derecha. */
export function TDNum({ className = '', children, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={`px-4 py-3 text-right tabular-nums text-ink-2 ${className}`} {...props}>
      {children}
    </td>
  )
}

export function RowActions({ children }: { children: ReactNode }) {
  return <div className="flex items-center justify-end gap-1">{children}</div>
}

import type { ReactNode } from 'react'

/** Bloque de contenido. La elevación se declara con borde, nunca borde + sombra. */
export function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-[var(--radius-card)] border border-line bg-surface ${className}`}>
      {children}
    </section>
  )
}

export function PanelHeader({
  title,
  meta,
  action,
}: {
  title: string
  meta?: ReactNode
  action?: ReactNode
}) {
  return (
    <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
      <div className="flex items-baseline gap-2">
        <h2 className="text-[13px] font-semibold tracking-[-0.005em] text-ink">{title}</h2>
        {meta && <span className="text-xs text-ink-3">{meta}</span>}
      </div>
      {action}
    </header>
  )
}

/** Etiqueta de sección: separa grupos sin el peso de un encabezado completo. */
export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-3">{children}</h2>
  )
}

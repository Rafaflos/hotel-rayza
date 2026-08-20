import type { ReactNode } from 'react'

export type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info'

const tones: Record<Tone, string> = {
  neutral: 'bg-canvas text-ink-2 ring-line-strong',
  success: 'bg-ok-soft text-ok ring-ok/25',
  warning: 'bg-warn-soft text-warn ring-warn/25',
  danger: 'bg-risk-soft text-risk ring-risk/25',
  info: 'bg-info-soft text-info ring-info/25',
}

export function Badge({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11.5px] font-medium
        leading-5 ring-1 ring-inset ${tones[tone]}`}
    >
      {children}
    </span>
  )
}

/** Punto de color para estados en listas densas, donde una pastilla pesa demasiado. */
export function Dot({ tone = 'neutral' }: { tone?: Tone }) {
  const colors: Record<Tone, string> = {
    neutral: 'bg-ink-3',
    success: 'bg-ok',
    warning: 'bg-warn',
    danger: 'bg-risk',
    info: 'bg-info',
  }
  return <span className={`inline-block size-1.5 shrink-0 rounded-full ${colors[tone]}`} />
}

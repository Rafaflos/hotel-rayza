import type { ReactNode } from 'react'

/**
 * Cifra de apoyo. Deliberadamente sobria: en el panel las cifras compiten con
 * la alerta de vencidas y con la caja, que son lo que exige acción.
 */
export function StatCard({
  label,
  value,
  hint,
  tone = 'default',
}: {
  label: string
  value: ReactNode
  hint?: string
  tone?: 'default' | 'money'
}) {
  return (
    <div className="rounded-[var(--radius-card)] border border-line bg-surface px-4 py-3.5">
      <p className="text-[12px] font-medium text-ink-3">{label}</p>
      <p
        className={`mt-1 tabular-nums font-semibold tracking-[-0.02em] text-ink ${
          tone === 'money' ? 'text-[19px]' : 'text-[24px] leading-7'
        }`}
      >
        {value}
      </p>
      {hint && <p className="mt-0.5 text-[11.5px] text-ink-3">{hint}</p>}
    </div>
  )
}

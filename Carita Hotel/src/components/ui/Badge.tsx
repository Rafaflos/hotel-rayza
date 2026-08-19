import type { ReactNode } from 'react'

export type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info'

const tones: Record<Tone, string> = {
  neutral: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
  success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  warning: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  danger: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400',
  info: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
}

export function Badge({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  )
}

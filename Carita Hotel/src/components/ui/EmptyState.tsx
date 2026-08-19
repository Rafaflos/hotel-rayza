import type { ReactNode } from 'react'

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 px-4 py-16 text-center">
      <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{title}</p>
      <p className="max-w-sm text-sm text-neutral-500 dark:text-neutral-400">{description}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}

import type { ReactNode } from 'react'

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">{title}</h2>
        {description && <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{description}</p>}
      </div>
      {action}
    </div>
  )
}

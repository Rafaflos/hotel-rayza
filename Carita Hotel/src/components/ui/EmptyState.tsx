import type { ReactNode } from 'react'

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
      {icon && (
        <div className="mb-1 flex size-11 items-center justify-center rounded-full bg-canvas text-ink-3">
          {icon}
        </div>
      )}
      <p className="text-sm font-medium text-ink">{title}</p>
      <p className="max-w-sm text-[13px] leading-relaxed text-ink-3">{description}</p>
      {action && <div className="mt-3">{action}</div>}
    </div>
  )
}

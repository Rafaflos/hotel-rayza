import { IconAlert } from './icons'

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="mb-4 flex items-start gap-2.5 rounded-lg border border-risk/25 bg-risk-soft px-3.5 py-2.5 text-[13px] text-risk"
    >
      <IconAlert className="mt-0.5 size-4 shrink-0" />
      <span>{message}</span>
    </div>
  )
}

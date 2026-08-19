import type { ReactNode } from 'react'

interface FieldProps {
  label: string
  htmlFor: string
  error?: string
  required?: boolean
  children: ReactNode
}

export function Field({ label, htmlFor, error, required, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {label}
        {required && <span className="text-red-600 dark:text-red-400"> *</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  )
}

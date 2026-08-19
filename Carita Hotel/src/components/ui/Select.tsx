import { forwardRef, type SelectHTMLAttributes } from 'react'

const selectClasses =
  'w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100'

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className = '', ...props }, ref) => (
    <select ref={ref} className={`${selectClasses} ${className}`} {...props} />
  ),
)
Select.displayName = 'Select'

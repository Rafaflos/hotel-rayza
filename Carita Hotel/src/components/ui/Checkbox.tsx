import { forwardRef, type InputHTMLAttributes } from 'react'

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({ label, id, className = '', ...props }, ref) => (
  <label htmlFor={id} className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
    <input
      ref={ref}
      id={id}
      type="checkbox"
      className={`h-4 w-4 rounded border-neutral-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-900 ${className}`}
      {...props}
    />
    {label}
  </label>
))
Checkbox.displayName = 'Checkbox'

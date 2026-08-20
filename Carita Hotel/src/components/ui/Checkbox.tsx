import { forwardRef, type InputHTMLAttributes } from 'react'

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, id, className = '', ...props }, ref) => (
    <label
      htmlFor={id}
      className="flex cursor-pointer select-none items-center gap-2.5 text-sm text-ink-2"
    >
      <input
        ref={ref}
        id={id}
        type="checkbox"
        className={`size-4 cursor-pointer rounded border-line-strong accent-brand ${className}`}
        {...props}
      />
      {label}
    </label>
  ),
)
Checkbox.displayName = 'Checkbox'

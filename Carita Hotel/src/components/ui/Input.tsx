import { forwardRef, type InputHTMLAttributes } from 'react'

export const controlClasses =
  'h-9.5 w-full rounded-lg border border-line bg-surface px-3 text-sm text-ink ' +
  'placeholder:text-ink-3 transition-[border-color,box-shadow] duration-150 ' +
  'hover:border-line-strong ' +
  'focus:outline-none focus:border-brand focus:ring-[3px] focus:ring-brand/18 ' +
  'disabled:opacity-45 disabled:cursor-not-allowed'

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...props }, ref) => (
    <input ref={ref} className={`${controlClasses} ${className}`} {...props} />
  ),
)
Input.displayName = 'Input'

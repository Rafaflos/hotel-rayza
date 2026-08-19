import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

const base =
  'inline-flex items-center justify-center gap-1.5 rounded-md text-sm font-medium px-3 py-2 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-950 disabled:opacity-50 disabled:pointer-events-none'

const variants: Record<Variant, string> = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700',
  secondary:
    'bg-white text-neutral-900 border border-neutral-300 hover:bg-neutral-50 active:bg-neutral-100 dark:bg-neutral-900 dark:text-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800',
  danger: 'bg-red-600 text-white hover:bg-red-500 active:bg-red-700',
  ghost:
    'text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200 dark:text-neutral-300 dark:hover:bg-neutral-800',
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />
}

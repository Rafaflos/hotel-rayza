import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const base =
  'inline-flex items-center justify-center gap-1.5 rounded-lg font-medium whitespace-nowrap ' +
  'transition-[background-color,border-color,color,box-shadow] duration-150 ' +
  'disabled:opacity-45 disabled:pointer-events-none'

const sizes: Record<Size, string> = {
  sm: 'h-8 px-2.5 text-[13px]',
  md: 'h-9.5 px-3.5 text-sm',
}

const variants: Record<Variant, string> = {
  primary: 'bg-brand text-white shadow-[0_1px_2px_rgb(15_23_42/0.12)] hover:bg-brand-hover active:translate-y-px',
  secondary: 'bg-surface text-ink border border-line hover:border-line-strong hover:bg-canvas active:translate-y-px',
  ghost: 'text-ink-2 hover:bg-canvas hover:text-ink active:translate-y-px',
  danger: 'bg-risk text-white hover:brightness-110 active:translate-y-px',
}

export function Button({ variant = 'primary', size = 'md', className = '', ...props }: ButtonProps) {
  return <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props} />
}

import { forwardRef, type SelectHTMLAttributes } from 'react'
import { controlClasses } from './Input'

/** Flecha propia en SVG para que el select no herede el control gris del sistema. */
const flecha =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='%236b7a8f' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 6.5 8 10.5l4-4'/%3E%3C/svg%3E\")"

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className = '', style, ...props }, ref) => (
    <select
      ref={ref}
      className={`${controlClasses} cursor-pointer appearance-none pr-9 ${className}`}
      style={{
        backgroundImage: flecha,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 10px center',
        backgroundSize: '16px',
        ...style,
      }}
      {...props}
    />
  ),
)
Select.displayName = 'Select'

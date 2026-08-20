import { useEffect, useRef, type ReactNode } from 'react'
import { IconClose } from './icons'

interface DialogProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  /** Ancho del panel; los formularios largos usan 'lg'. */
  size?: 'md' | 'lg'
}

export function Dialog({ open, onClose, title, description, children, size = 'md' }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    else if (!open && dialog.open) dialog.close()
  }, [open])

  const ancho = size === 'lg' ? 'max-w-2xl' : 'max-w-md'

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose()
      }}
      className={`fixed left-1/2 top-1/2 max-h-[86vh] w-[calc(100%-2rem)] ${ancho}
        -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[var(--radius-card)]
        bg-surface p-0 text-ink shadow-[var(--shadow-pop)]`}
    >
      <div className="flex max-h-[86vh] flex-col">
        <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div>
            <h2 className="text-[15px] font-semibold tracking-[-0.01em]">{title}</h2>
            {description && <p className="mt-0.5 text-[13px] text-ink-3">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="-mr-1 -mt-0.5 rounded-md p-1.5 text-ink-3 transition-colors duration-150
              hover:bg-canvas hover:text-ink"
          >
            <IconClose className="size-4.5" />
          </button>
        </header>
        <div className="overflow-y-auto px-5 py-4">{children}</div>
      </div>
    </dialog>
  )
}

/** Pie de diálogo: separa visualmente las acciones del formulario. */
export function DialogFooter({ children }: { children: ReactNode }) {
  return <div className="mt-5 flex items-center justify-end gap-2 border-t border-line pt-4">{children}</div>
}

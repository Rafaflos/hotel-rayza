import { useState, type FormEvent } from 'react'
import { Button } from './ui/Button'
import { Dialog } from './ui/Dialog'
import { ErrorBanner } from './ui/ErrorBanner'
import { Field } from './ui/Field'
import { Input } from './ui/Input'
import { getErrorMessage } from '../services/errors'
import { authService } from '../services/usuarios'

export function CambiarPasswordDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [current, setCurrent] = useState('')
  const [nueva, setNueva] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [ok, setOk] = useState(false)
  const [saving, setSaving] = useState(false)

  const reset = () => {
    setCurrent('')
    setNueva('')
    setConfirmar('')
    setError(null)
    setOk(false)
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (nueva !== confirmar) {
      setError('La nueva contraseña y su confirmación no coinciden')
      return
    }
    setSaving(true)
    try {
      await authService.changePassword(current, nueva)
      setOk(true)
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo cambiar la contraseña'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} title="Cambiar contraseña">
      {ok ? (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-ink-2">Tu contraseña se actualizó correctamente.</p>
          <div className="flex justify-end">
            <Button onClick={handleClose}>Cerrar</Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && <ErrorBanner message={error} />}
          <Field label="Contraseña actual" htmlFor="current" required>
            <Input id="current" type="password" value={current} onChange={(e) => setCurrent(e.target.value)} required />
          </Field>
          <Field label="Nueva contraseña" htmlFor="nueva" required>
            <Input id="nueva" type="password" value={nueva} onChange={(e) => setNueva(e.target.value)} required />
          </Field>
          <Field label="Confirmar nueva contraseña" htmlFor="confirmar" required>
            <Input
              id="confirmar"
              type="password"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              required
            />
          </Field>
          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Guardando…' : 'Cambiar contraseña'}
            </Button>
          </div>
        </form>
      )}
    </Dialog>
  )
}

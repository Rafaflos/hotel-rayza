import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Checkbox } from '../components/ui/Checkbox'
import { Dialog } from '../components/ui/Dialog'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorBanner } from '../components/ui/ErrorBanner'
import { Field } from '../components/ui/Field'
import { Input } from '../components/ui/Input'
import { PageHeader } from '../components/ui/PageHeader'
import { TableSkeleton } from '../components/ui/Skeleton'
import { checkinsService } from '../services/checkins'
import { getErrorMessage } from '../services/errors'
import { reservasService } from '../services/reservas'
import type { Reserva } from '../types'
import { estadoReservaInfo } from '../utils/estado'

export function CheckIn() {
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [target, setTarget] = useState<Reserva | null>(null)
  const [documentoVerificado, setDocumentoVerificado] = useState(false)
  const [observaciones, setObservaciones] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const pendientes = useMemo(
    () => reservas.filter((r) => r.estado === 'PENDIENTE' || r.estado === 'CONFIRMADA'),
    [reservas],
  )

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      setReservas(await reservasService.list())
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudieron cargar las reservas'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const openDialog = (reserva: Reserva) => {
    setTarget(reserva)
    setDocumentoVerificado(false)
    setObservaciones('')
    setFormError(null)
    setDialogOpen(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!target) return
    setSaving(true)
    setFormError(null)
    try {
      await checkinsService.create({ reservaId: target.id, documentoVerificado, observaciones: observaciones || undefined })
      setDialogOpen(false)
      await load()
    } catch (err) {
      setFormError(getErrorMessage(err, 'No se pudo registrar el check-in'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader title="Check-in" description="Reservas listas para registrar la entrada del huésped." />

      {error && <ErrorBanner message={error} />}

      <div className="overflow-x-auto rounded-lg border border-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-canvas text-xs uppercase tracking-wide text-ink-3">
            <tr>
              <th className="px-4 py-3 font-medium">Código</th>
              <th className="px-4 py-3 font-medium">Huésped</th>
              <th className="px-4 py-3 font-medium">Habitación</th>
              <th className="px-4 py-3 font-medium">Entrada</th>
              <th className="px-4 py-3 font-medium">Salida</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {loading ? (
              <TableSkeleton columns={7} />
            ) : (
              pendientes.map((r) => (
                <tr key={r.id} className="hover:bg-canvas/60">
                  <td className="px-4 py-3 font-medium text-ink">{r.codigo}</td>
                  <td className="px-4 py-3 text-ink-2">
                    {r.huespedPrincipal.nombres} {r.huespedPrincipal.apellidos}
                  </td>
                  <td className="px-4 py-3 text-ink-2">{r.habitacion.numero}</td>
                  <td className="px-4 py-3 tabular-nums text-ink-2">{r.fechaEntrada}</td>
                  <td className="px-4 py-3 tabular-nums text-ink-2">{r.fechaSalida}</td>
                  <td className="px-4 py-3">
                    <Badge tone={estadoReservaInfo[r.estado].tone}>{estadoReservaInfo[r.estado].label}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="secondary" className="px-2 py-1" onClick={() => openDialog(r)}>
                      Registrar check-in
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {!loading && pendientes.length === 0 && (
          <EmptyState
            title="No hay reservas pendientes de check-in"
            description="Las reservas pendientes o confirmadas aparecerán aquí para registrar la entrada del huésped."
          />
        )}
      </div>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title={`Check-in — ${target?.codigo ?? ''}`}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {formError && <ErrorBanner message={formError} />}

          {target && (
            <p className="text-sm text-ink-2">
              {target.huespedPrincipal.nombres} {target.huespedPrincipal.apellidos} — Habitación {target.habitacion.numero}
            </p>
          )}

          <Checkbox
            id="documentoVerificado"
            label="Documento de identidad verificado"
            checked={documentoVerificado}
            onChange={(e) => setDocumentoVerificado(e.target.checked)}
          />

          <Field label="Observaciones" htmlFor="observaciones">
            <Input id="observaciones" value={observaciones} onChange={(e) => setObservaciones(e.target.value)} />
          </Field>

          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Registrando…' : 'Registrar check-in'}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  )
}

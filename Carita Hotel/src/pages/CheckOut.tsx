import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Dialog } from '../components/ui/Dialog'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorBanner } from '../components/ui/ErrorBanner'
import { Field } from '../components/ui/Field'
import { Input } from '../components/ui/Input'
import { PageHeader } from '../components/ui/PageHeader'
import { TableSkeleton } from '../components/ui/Skeleton'
import { checkoutsService } from '../services/checkouts'
import { getErrorMessage } from '../services/errors'
import { reservasService } from '../services/reservas'
import type { Reserva } from '../types'
import { estadoReservaInfo } from '../utils/estado'

export function CheckOut() {
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [target, setTarget] = useState<Reserva | null>(null)
  const [descuento, setDescuento] = useState(0)
  const [observaciones, setObservaciones] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [result, setResult] = useState<{ total: number } | null>(null)

  const enCurso = useMemo(() => reservas.filter((r) => r.estado === 'CHECK_IN'), [reservas])

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
    setDescuento(0)
    setObservaciones('')
    setFormError(null)
    setResult(null)
    setDialogOpen(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!target) return
    setSaving(true)
    setFormError(null)
    try {
      const checkout = await checkoutsService.create({
        reservaId: target.id,
        descuento: descuento || undefined,
        observaciones: observaciones || undefined,
      })
      setResult({ total: checkout.total })
      await load()
    } catch (err) {
      setFormError(getErrorMessage(err, 'No se pudo registrar el check-out'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader title="Check-out" description="Reservas con check-in en curso, listas para cerrar la estadía." />

      {error && <ErrorBanner message={error} />}

      <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
            <tr>
              <th className="px-4 py-3 font-medium">Código</th>
              <th className="px-4 py-3 font-medium">Huésped</th>
              <th className="px-4 py-3 font-medium">Habitación</th>
              <th className="px-4 py-3 font-medium">Salida</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {loading ? (
              <TableSkeleton columns={7} />
            ) : (
              enCurso.map((r) => (
                <tr key={r.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/60">
                  <td className="px-4 py-3 font-medium text-neutral-900 dark:text-neutral-100">{r.codigo}</td>
                  <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">
                    {r.huespedPrincipal.nombres} {r.huespedPrincipal.apellidos}
                  </td>
                  <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">{r.habitacion.numero}</td>
                  <td className="px-4 py-3 tabular-nums text-neutral-600 dark:text-neutral-400">{r.fechaSalida}</td>
                  <td className="px-4 py-3 tabular-nums text-neutral-600 dark:text-neutral-400">S/ {r.total.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <Badge tone={estadoReservaInfo[r.estado].tone}>{estadoReservaInfo[r.estado].label}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="secondary" className="px-2 py-1" onClick={() => openDialog(r)}>
                      Registrar check-out
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {!loading && enCurso.length === 0 && (
          <EmptyState
            title="No hay estadías en curso"
            description="Las reservas con check-in registrado aparecerán aquí para cerrar la estadía."
          />
        )}
      </div>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title={`Check-out — ${target?.codigo ?? ''}`}>
        {result ? (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Check-out registrado. Total de la estadía: <span className="font-semibold text-neutral-900 dark:text-neutral-100">S/ {result.total.toFixed(2)}</span>
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Recuerda registrar el pago correspondiente en la sección Pagos.
            </p>
            <div className="mt-2 flex justify-end">
              <Button onClick={() => setDialogOpen(false)}>Cerrar</Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {formError && <ErrorBanner message={formError} />}

            {target && (
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {target.huespedPrincipal.nombres} {target.huespedPrincipal.apellidos} — Habitación {target.habitacion.numero} — Hospedaje S/ {target.total.toFixed(2)}
              </p>
            )}

            <Field label="Descuento adicional (S/)" htmlFor="descuento">
              <Input
                id="descuento"
                type="number"
                min={0}
                step="0.01"
                value={descuento}
                onChange={(e) => setDescuento(Number(e.target.value))}
              />
            </Field>

            <Field label="Observaciones" htmlFor="observaciones">
              <Input id="observaciones" value={observaciones} onChange={(e) => setObservaciones(e.target.value)} />
            </Field>

            <div className="mt-2 flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Registrando…' : 'Registrar check-out'}
              </Button>
            </div>
          </form>
        )}
      </Dialog>
    </div>
  )
}

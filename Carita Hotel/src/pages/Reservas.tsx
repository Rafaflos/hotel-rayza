import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Dialog } from '../components/ui/Dialog'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorBanner } from '../components/ui/ErrorBanner'
import { Field } from '../components/ui/Field'
import { Input } from '../components/ui/Input'
import { PageHeader } from '../components/ui/PageHeader'
import { Select } from '../components/ui/Select'
import { TableSkeleton } from '../components/ui/Skeleton'
import { getErrorMessage } from '../services/errors'
import { habitacionesService } from '../services/habitaciones'
import { huespedesService } from '../services/huespedes'
import { reservasService } from '../services/reservas'
import type { Habitacion, Huesped, Reserva, ReservaInput } from '../types'
import { estadoReservaInfo } from '../utils/estado'

const today = new Date().toISOString().slice(0, 10)

const emptyForm: ReservaInput = {
  huespedPrincipalId: 0,
  habitacionId: 0,
  fechaEntrada: today,
  fechaSalida: today,
  cantidadHuespedes: 1,
  descuento: 0,
  observaciones: '',
}

export function Reservas() {
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [huespedes, setHuespedes] = useState<Huesped[]>([])
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionId, setActionId] = useState<number | null>(null)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState<ReservaInput>(emptyForm)
  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const habitacionesDisponibles = useMemo(
    () => habitaciones.filter((h) => h.estado === 'DISPONIBLE'),
    [habitaciones],
  )

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const [reservasData, huespedesData, habitacionesData] = await Promise.all([
        reservasService.list(),
        huespedesService.list(),
        habitacionesService.list(),
      ])
      setReservas(reservasData)
      setHuespedes(huespedesData)
      setHabitaciones(habitacionesData)
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudieron cargar las reservas'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const openCreate = () => {
    setForm({
      ...emptyForm,
      huespedPrincipalId: huespedes[0]?.id ?? 0,
      habitacionId: habitacionesDisponibles[0]?.id ?? 0,
    })
    setFormError(null)
    setDialogOpen(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setFormError(null)
    try {
      await reservasService.create(form)
      setDialogOpen(false)
      await load()
    } catch (err) {
      setFormError(getErrorMessage(err, 'No se pudo crear la reserva'))
    } finally {
      setSaving(false)
    }
  }

  const handleConfirmar = async (reserva: Reserva) => {
    setActionId(reserva.id)
    setError(null)
    try {
      await reservasService.confirmar(reserva.id)
      await load()
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo confirmar la reserva'))
    } finally {
      setActionId(null)
    }
  }

  const handleCancelar = async (reserva: Reserva) => {
    if (!confirm(`¿Cancelar la reserva ${reserva.codigo}?`)) return
    setActionId(reserva.id)
    setError(null)
    try {
      await reservasService.cancelar(reserva.id)
      await load()
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo cancelar la reserva'))
    } finally {
      setActionId(null)
    }
  }

  return (
    <div>
      <PageHeader
        title="Reservas"
        description="Crea reservas y da seguimiento a su estado."
        action={
          <Button onClick={openCreate} disabled={huespedes.length === 0 || habitacionesDisponibles.length === 0}>
            Nueva reserva
          </Button>
        }
      />

      {error && <ErrorBanner message={error} />}

      {!loading && habitacionesDisponibles.length === 0 && habitaciones.length > 0 && (
        <p className="mb-4 text-sm text-neutral-500 dark:text-neutral-400">
          No hay habitaciones disponibles en este momento para crear una nueva reserva.
        </p>
      )}

      <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
            <tr>
              <th className="px-4 py-3 font-medium">Código</th>
              <th className="px-4 py-3 font-medium">Huésped</th>
              <th className="px-4 py-3 font-medium">Habitación</th>
              <th className="px-4 py-3 font-medium">Entrada</th>
              <th className="px-4 py-3 font-medium">Salida</th>
              <th className="px-4 py-3 font-medium">Noches</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {loading ? (
              <TableSkeleton columns={9} />
            ) : (
              reservas.map((r) => (
                <tr key={r.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/60">
                  <td className="px-4 py-3 font-medium text-neutral-900 dark:text-neutral-100">{r.codigo}</td>
                  <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">
                    {r.huespedPrincipal.nombres} {r.huespedPrincipal.apellidos}
                  </td>
                  <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">{r.habitacion.numero}</td>
                  <td className="px-4 py-3 tabular-nums text-neutral-600 dark:text-neutral-400">{r.fechaEntrada}</td>
                  <td className="px-4 py-3 tabular-nums text-neutral-600 dark:text-neutral-400">{r.fechaSalida}</td>
                  <td className="px-4 py-3 tabular-nums text-neutral-600 dark:text-neutral-400">{r.cantidadNoches}</td>
                  <td className="px-4 py-3 tabular-nums text-neutral-600 dark:text-neutral-400">S/ {r.total.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <Badge tone={estadoReservaInfo[r.estado].tone}>{estadoReservaInfo[r.estado].label}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      {r.estado === 'PENDIENTE' && (
                        <Button
                          variant="ghost"
                          className="px-2 py-1"
                          disabled={actionId === r.id}
                          onClick={() => handleConfirmar(r)}
                        >
                          Confirmar
                        </Button>
                      )}
                      {(r.estado === 'PENDIENTE' || r.estado === 'CONFIRMADA') && (
                        <Button
                          variant="ghost"
                          className="px-2 py-1 text-red-600 dark:text-red-400"
                          disabled={actionId === r.id}
                          onClick={() => handleCancelar(r)}
                        >
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {!loading && reservas.length === 0 && (
          <EmptyState
            title="Todavía no hay reservas"
            description="Crea una reserva seleccionando un huésped y una habitación disponible."
            action={
              <Button onClick={openCreate} disabled={huespedes.length === 0 || habitacionesDisponibles.length === 0}>
                Nueva reserva
              </Button>
            }
          />
        )}
      </div>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title="Nueva reserva">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {formError && <ErrorBanner message={formError} />}

          <Field label="Huésped" htmlFor="huespedPrincipalId" required>
            <Select
              id="huespedPrincipalId"
              value={form.huespedPrincipalId}
              onChange={(e) => setForm({ ...form, huespedPrincipalId: Number(e.target.value) })}
              required
            >
              <option value={0} disabled>
                Selecciona un huésped
              </option>
              {huespedes.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.nombres} {h.apellidos} — {h.numeroDocumento}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Habitación" htmlFor="habitacionId" required>
            <Select
              id="habitacionId"
              value={form.habitacionId}
              onChange={(e) => setForm({ ...form, habitacionId: Number(e.target.value) })}
              required
            >
              <option value={0} disabled>
                Selecciona una habitación disponible
              </option>
              {habitacionesDisponibles.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.numero} — {h.tipo.nombre} (cap. {h.capacidad}) — S/ {h.precioNoche.toFixed(2)}/noche
                </option>
              ))}
            </Select>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Fecha de entrada" htmlFor="fechaEntrada" required>
              <Input
                id="fechaEntrada"
                type="date"
                min={today}
                value={form.fechaEntrada}
                onChange={(e) => setForm({ ...form, fechaEntrada: e.target.value })}
                required
              />
            </Field>
            <Field label="Fecha de salida" htmlFor="fechaSalida" required>
              <Input
                id="fechaSalida"
                type="date"
                min={form.fechaEntrada}
                value={form.fechaSalida}
                onChange={(e) => setForm({ ...form, fechaSalida: e.target.value })}
                required
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Cantidad de huéspedes" htmlFor="cantidadHuespedes" required>
              <Input
                id="cantidadHuespedes"
                type="number"
                min={1}
                value={form.cantidadHuespedes}
                onChange={(e) => setForm({ ...form, cantidadHuespedes: Number(e.target.value) })}
                required
              />
            </Field>
            <Field label="Descuento (S/)" htmlFor="descuento">
              <Input
                id="descuento"
                type="number"
                min={0}
                step="0.01"
                value={form.descuento}
                onChange={(e) => setForm({ ...form, descuento: Number(e.target.value) })}
              />
            </Field>
          </div>

          <Field label="Observaciones" htmlFor="observaciones">
            <Input
              id="observaciones"
              value={form.observaciones}
              onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
            />
          </Field>

          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving || form.huespedPrincipalId === 0 || form.habitacionId === 0}>
              {saving ? 'Creando…' : 'Crear reserva'}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  )
}

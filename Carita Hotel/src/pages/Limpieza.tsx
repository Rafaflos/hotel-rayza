import { useEffect, useState, type FormEvent } from 'react'
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
import { empleadosService } from '../services/empleados'
import { getErrorMessage } from '../services/errors'
import { habitacionesService } from '../services/habitaciones'
import { limpiezasService } from '../services/limpiezas'
import type { Habitacion, Limpieza as LimpiezaType } from '../types'
import type { Empleado } from '../types/empleado'
import { estadoLimpiezaInfo } from '../utils/estado'

export function Limpieza() {
  const [tareas, setTareas] = useState<LimpiezaType[]>([])
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([])
  const [empleados, setEmpleados] = useState<Empleado[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionId, setActionId] = useState<number | null>(null)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [habitacionId, setHabitacionId] = useState(0)
  const [empleadoId, setEmpleadoId] = useState(0)
  const [observaciones, setObservaciones] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const [tareasData, habitacionesData, empleadosData] = await Promise.all([
        limpiezasService.pendientes(),
        habitacionesService.list(),
        empleadosService.activos(),
      ])
      setTareas(tareasData)
      setHabitaciones(habitacionesData)
      setEmpleados(empleadosData)
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudieron cargar las tareas de limpieza'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const openDialog = () => {
    setHabitacionId(0)
    setEmpleadoId(0)
    setObservaciones('')
    setFormError(null)
    setDialogOpen(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!habitacionId) return
    setSaving(true)
    setFormError(null)
    try {
      await limpiezasService.create({
        habitacionId,
        empleadoId: empleadoId || undefined,
        observaciones: observaciones || undefined,
      })
      setDialogOpen(false)
      await load()
    } catch (err) {
      setFormError(getErrorMessage(err, 'No se pudo registrar la tarea'))
    } finally {
      setSaving(false)
    }
  }

  const handleIniciar = async (id: number) => {
    setActionId(id)
    try {
      await limpiezasService.iniciar(id)
      await load()
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo iniciar la limpieza'))
    } finally {
      setActionId(null)
    }
  }

  const handleCompletar = async (id: number) => {
    setActionId(id)
    try {
      await limpiezasService.completar(id)
      await load()
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo completar la limpieza'))
    } finally {
      setActionId(null)
    }
  }

  const handleObservar = async (id: number) => {
    const nota = prompt('Describe la observación (ej. daño encontrado):')
    if (nota === null) return
    setActionId(id)
    try {
      await limpiezasService.observar(id, nota || undefined)
      await load()
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo marcar como observada'))
    } finally {
      setActionId(null)
    }
  }

  return (
    <div>
      <PageHeader
        title="Limpieza"
        description="Tareas de limpieza pendientes o en proceso. Se generan automáticamente al hacer check-out."
        action={<Button onClick={openDialog}>Nueva tarea</Button>}
      />

      {error && <ErrorBanner message={error} />}

      <div className="overflow-x-auto rounded-lg border border-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-canvas text-xs uppercase tracking-wide text-ink-3">
            <tr>
              <th className="px-4 py-3 font-medium">Habitación</th>
              <th className="px-4 py-3 font-medium">Fecha</th>
              <th className="px-4 py-3 font-medium">Responsable</th>
              <th className="px-4 py-3 font-medium">Observaciones</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {loading ? (
              <TableSkeleton columns={6} />
            ) : (
              tareas.map((t) => (
                <tr key={t.id} className="hover:bg-canvas/60">
                  <td className="px-4 py-3 font-medium text-ink">{t.habitacion.numero}</td>
                  <td className="px-4 py-3 tabular-nums text-ink-2">
                    {t.fechaHora.slice(0, 16).replace('T', ' ')}
                  </td>
                  <td className="px-4 py-3 text-ink-2">{t.empleadoNombre || '—'}</td>
                  <td className="px-4 py-3 text-ink-2">{t.observaciones || '—'}</td>
                  <td className="px-4 py-3">
                    <Badge tone={estadoLimpiezaInfo[t.estado].tone}>{estadoLimpiezaInfo[t.estado].label}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      {t.estado === 'PENDIENTE' && (
                        <Button variant="ghost" className="px-2 py-1" disabled={actionId === t.id} onClick={() => handleIniciar(t.id)}>
                          Iniciar
                        </Button>
                      )}
                      <Button variant="ghost" className="px-2 py-1" disabled={actionId === t.id} onClick={() => handleCompletar(t.id)}>
                        Completar
                      </Button>
                      <Button
                        variant="ghost"
                        className="px-2 py-1 text-warn"
                        disabled={actionId === t.id}
                        onClick={() => handleObservar(t.id)}
                      >
                        Observar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {!loading && tareas.length === 0 && (
          <EmptyState
            title="No hay tareas de limpieza pendientes"
            description="Las tareas generadas tras un check-out, o creadas manualmente, aparecerán aquí."
            action={<Button onClick={openDialog}>Nueva tarea</Button>}
          />
        )}
      </div>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title="Nueva tarea de limpieza">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {formError && <ErrorBanner message={formError} />}
          <Field label="Habitación" htmlFor="habitacionId" required>
            <Select id="habitacionId" value={habitacionId} onChange={(e) => setHabitacionId(Number(e.target.value))} required>
              <option value={0} disabled>
                Selecciona una habitación
              </option>
              {habitaciones.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.numero} — {h.tipo.nombre}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Responsable (opcional)" htmlFor="empleadoId">
            <Select id="empleadoId" value={empleadoId} onChange={(e) => setEmpleadoId(Number(e.target.value))}>
              <option value={0}>Sin asignar</option>
              {empleados.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.nombres} {emp.apellidos}
                  {emp.cargo ? ` — ${emp.cargo}` : ''}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Observaciones" htmlFor="observaciones">
            <Input id="observaciones" value={observaciones} onChange={(e) => setObservaciones(e.target.value)} />
          </Field>
          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving || !habitacionId}>
              {saving ? 'Creando…' : 'Crear tarea'}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  )
}

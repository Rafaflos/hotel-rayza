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
import { mantenimientosService } from '../services/mantenimientos'
import type { Habitacion, Mantenimiento as MantenimientoType, Prioridad } from '../types'
import type { Empleado } from '../types/empleado'
import { estadoMantenimientoInfo, prioridadInfo } from '../utils/estado'

export function Mantenimiento() {
  const [tareas, setTareas] = useState<MantenimientoType[]>([])
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([])
  const [empleados, setEmpleados] = useState<Empleado[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionId, setActionId] = useState<number | null>(null)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [habitacionId, setHabitacionId] = useState(0)
  const [problema, setProblema] = useState('')
  const [prioridad, setPrioridad] = useState<Prioridad>('MEDIA')
  const [responsableId, setResponsableId] = useState(0)
  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const [tareasData, habitacionesData, empleadosData] = await Promise.all([
        mantenimientosService.pendientes(),
        habitacionesService.list(),
        empleadosService.activos(),
      ])
      setTareas(tareasData)
      setHabitaciones(habitacionesData)
      setEmpleados(empleadosData)
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudieron cargar las tareas de mantenimiento'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const openDialog = () => {
    setHabitacionId(0)
    setProblema('')
    setPrioridad('MEDIA')
    setResponsableId(0)
    setFormError(null)
    setDialogOpen(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!habitacionId) return
    setSaving(true)
    setFormError(null)
    try {
      await mantenimientosService.create({ habitacionId, problema, prioridad, responsableId: responsableId || undefined })
      setDialogOpen(false)
      await load()
    } catch (err) {
      setFormError(getErrorMessage(err, 'No se pudo reportar el problema'))
    } finally {
      setSaving(false)
    }
  }

  const handleIniciar = async (id: number) => {
    setActionId(id)
    try {
      await mantenimientosService.iniciar(id)
      await load()
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo iniciar el mantenimiento'))
    } finally {
      setActionId(null)
    }
  }

  const handleCompletar = async (id: number) => {
    const solucion = prompt('Describe la solución aplicada:')
    if (!solucion) return
    setActionId(id)
    try {
      await mantenimientosService.completar(id, solucion)
      await load()
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo completar el mantenimiento'))
    } finally {
      setActionId(null)
    }
  }

  const handleCancelar = async (id: number) => {
    if (!confirm('¿Cancelar este mantenimiento?')) return
    setActionId(id)
    try {
      await mantenimientosService.cancelar(id)
      await load()
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo cancelar el mantenimiento'))
    } finally {
      setActionId(null)
    }
  }

  return (
    <div>
      <PageHeader
        title="Mantenimiento"
        description="Problemas reportados en habitaciones, pendientes o en proceso."
        action={<Button onClick={openDialog}>Reportar problema</Button>}
      />

      {error && <ErrorBanner message={error} />}

      <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
            <tr>
              <th className="px-4 py-3 font-medium">Habitación</th>
              <th className="px-4 py-3 font-medium">Problema</th>
              <th className="px-4 py-3 font-medium">Prioridad</th>
              <th className="px-4 py-3 font-medium">Responsable</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {loading ? (
              <TableSkeleton columns={6} />
            ) : (
              tareas.map((t) => (
                <tr key={t.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/60">
                  <td className="px-4 py-3 font-medium text-neutral-900 dark:text-neutral-100">{t.habitacion.numero}</td>
                  <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">{t.problema}</td>
                  <td className="px-4 py-3">
                    <Badge tone={prioridadInfo[t.prioridad].tone}>{prioridadInfo[t.prioridad].label}</Badge>
                  </td>
                  <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">{t.responsableNombre || '—'}</td>
                  <td className="px-4 py-3">
                    <Badge tone={estadoMantenimientoInfo[t.estado].tone}>{estadoMantenimientoInfo[t.estado].label}</Badge>
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
                        className="px-2 py-1 text-red-600 dark:text-red-400"
                        disabled={actionId === t.id}
                        onClick={() => handleCancelar(t.id)}
                      >
                        Cancelar
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
            title="No hay problemas reportados"
            description="Los problemas de mantenimiento reportados en habitaciones aparecerán aquí."
            action={<Button onClick={openDialog}>Reportar problema</Button>}
          />
        )}
      </div>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title="Reportar problema">
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
          <Field label="Problema" htmlFor="problema" required>
            <Input id="problema" value={problema} onChange={(e) => setProblema(e.target.value)} required />
          </Field>
          <Field label="Prioridad" htmlFor="prioridad" required>
            <Select id="prioridad" value={prioridad} onChange={(e) => setPrioridad(e.target.value as Prioridad)}>
              {Object.entries(prioridadInfo).map(([value, info]) => (
                <option key={value} value={value}>
                  {info.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Responsable (opcional)" htmlFor="responsableId">
            <Select id="responsableId" value={responsableId} onChange={(e) => setResponsableId(Number(e.target.value))}>
              <option value={0}>Sin asignar</option>
              {empleados.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.nombres} {emp.apellidos}
                  {emp.cargo ? ` — ${emp.cargo}` : ''}
                </option>
              ))}
            </Select>
          </Field>
          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving || !habitacionId || !problema}>
              {saving ? 'Reportando…' : 'Reportar problema'}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  )
}

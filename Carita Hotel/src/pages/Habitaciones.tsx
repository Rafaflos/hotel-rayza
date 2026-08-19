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
import { habitacionesService } from '../services/habitaciones'
import { getErrorMessage } from '../services/errors'
import { tiposHabitacionService } from '../services/tiposHabitacion'
import type { EstadoHabitacion, Habitacion, HabitacionInput, TipoHabitacion } from '../types'
import { estadoHabitacionInfo } from '../utils/estado'

const emptyForm: HabitacionInput = {
  numero: '',
  piso: 1,
  tipoId: 0,
  capacidad: 1,
  precioNoche: 0,
  descripcion: '',
}

export function Habitaciones() {
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([])
  const [tipos, setTipos] = useState<TipoHabitacion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Habitacion | null>(null)
  const [form, setForm] = useState<HabitacionInput>(emptyForm)
  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const [habitacionesData, tiposData] = await Promise.all([
        habitacionesService.list(),
        tiposHabitacionService.list(),
      ])
      setHabitaciones(habitacionesData)
      setTipos(tiposData)
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudieron cargar las habitaciones'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const openCreate = () => {
    setEditing(null)
    setForm({ ...emptyForm, tipoId: tipos[0]?.id ?? 0 })
    setFormError(null)
    setDialogOpen(true)
  }

  const openEdit = (habitacion: Habitacion) => {
    setEditing(habitacion)
    setForm({
      numero: habitacion.numero,
      piso: habitacion.piso,
      tipoId: habitacion.tipo.id,
      capacidad: habitacion.capacidad,
      precioNoche: habitacion.precioNoche,
      estado: habitacion.estado,
      descripcion: habitacion.descripcion ?? '',
    })
    setFormError(null)
    setDialogOpen(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setFormError(null)
    try {
      if (editing) {
        await habitacionesService.update(editing.id, form)
      } else {
        await habitacionesService.create(form)
      }
      setDialogOpen(false)
      await load()
    } catch (err) {
      setFormError(getErrorMessage(err, 'No se pudo guardar la habitación'))
    } finally {
      setSaving(false)
    }
  }

  const handleDeactivate = async (habitacion: Habitacion) => {
    if (!confirm(`¿Marcar la habitación ${habitacion.numero} como fuera de servicio?`)) return
    try {
      await habitacionesService.remove(habitacion.id)
      await load()
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo actualizar la habitación'))
    }
  }

  return (
    <div>
      <PageHeader
        title="Habitaciones"
        description="Gestiona el inventario de habitaciones del hotel."
        action={
          <Button onClick={openCreate} disabled={tipos.length === 0 && !loading}>
            Nueva habitación
          </Button>
        }
      />

      {error && <ErrorBanner message={error} />}

      <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
            <tr>
              <th className="px-4 py-3 font-medium">Número</th>
              <th className="px-4 py-3 font-medium">Piso</th>
              <th className="px-4 py-3 font-medium">Tipo</th>
              <th className="px-4 py-3 font-medium">Capacidad</th>
              <th className="px-4 py-3 font-medium">Precio/noche</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {loading ? (
              <TableSkeleton columns={7} />
            ) : (
              habitaciones.map((h) => (
                <tr key={h.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/60">
                  <td className="px-4 py-3 font-medium text-neutral-900 dark:text-neutral-100">{h.numero}</td>
                  <td className="px-4 py-3 tabular-nums text-neutral-600 dark:text-neutral-400">{h.piso}</td>
                  <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">{h.tipo.nombre}</td>
                  <td className="px-4 py-3 tabular-nums text-neutral-600 dark:text-neutral-400">{h.capacidad}</td>
                  <td className="px-4 py-3 tabular-nums text-neutral-600 dark:text-neutral-400">
                    S/ {h.precioNoche.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={estadoHabitacionInfo[h.estado].tone}>{estadoHabitacionInfo[h.estado].label}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" className="px-2 py-1" onClick={() => openEdit(h)}>
                        Editar
                      </Button>
                      <Button variant="ghost" className="px-2 py-1 text-red-600 dark:text-red-400" onClick={() => handleDeactivate(h)}>
                        Dar de baja
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {!loading && habitaciones.length === 0 && (
          <EmptyState
            title="Todavía no hay habitaciones"
            description="Crea la primera habitación para empezar a gestionar el inventario del hotel."
            action={<Button onClick={openCreate}>Nueva habitación</Button>}
          />
        )}
      </div>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title={editing ? 'Editar habitación' : 'Nueva habitación'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {formError && <ErrorBanner message={formError} />}

          <Field label="Número" htmlFor="numero" required>
            <Input
              id="numero"
              value={form.numero}
              onChange={(e) => setForm({ ...form, numero: e.target.value })}
              required
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Piso" htmlFor="piso" required>
              <Input
                id="piso"
                type="number"
                min={0}
                value={form.piso}
                onChange={(e) => setForm({ ...form, piso: Number(e.target.value) })}
                required
              />
            </Field>
            <Field label="Capacidad" htmlFor="capacidad" required>
              <Input
                id="capacidad"
                type="number"
                min={1}
                value={form.capacidad}
                onChange={(e) => setForm({ ...form, capacidad: Number(e.target.value) })}
                required
              />
            </Field>
          </div>

          <Field label="Tipo de habitación" htmlFor="tipoId" required>
            <Select
              id="tipoId"
              value={form.tipoId}
              onChange={(e) => setForm({ ...form, tipoId: Number(e.target.value) })}
              required
            >
              <option value={0} disabled>
                Selecciona un tipo
              </option>
              {tipos.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Precio por noche (S/)" htmlFor="precioNoche" required>
            <Input
              id="precioNoche"
              type="number"
              min={0}
              step="0.01"
              value={form.precioNoche}
              onChange={(e) => setForm({ ...form, precioNoche: Number(e.target.value) })}
              required
            />
          </Field>

          {editing && (
            <Field label="Estado" htmlFor="estado" required>
              <Select
                id="estado"
                value={form.estado}
                onChange={(e) => setForm({ ...form, estado: e.target.value as EstadoHabitacion })}
              >
                {Object.entries(estadoHabitacionInfo).map(([value, info]) => (
                  <option key={value} value={value}>
                    {info.label}
                  </option>
                ))}
              </Select>
            </Field>
          )}

          <Field label="Descripción" htmlFor="descripcion">
            <Input
              id="descripcion"
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            />
          </Field>

          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving || form.tipoId === 0}>
              {saving ? 'Guardando…' : 'Guardar'}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  )
}

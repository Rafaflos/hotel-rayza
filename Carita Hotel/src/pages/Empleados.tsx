import { useEffect, useState, type FormEvent } from 'react'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Dialog } from '../components/ui/Dialog'
import { ErrorBanner } from '../components/ui/ErrorBanner'
import { Field } from '../components/ui/Field'
import { Input } from '../components/ui/Input'
import { PageHeader } from '../components/ui/PageHeader'
import { TableSkeleton } from '../components/ui/Skeleton'
import { empleadosService } from '../services/empleados'
import { getErrorMessage } from '../services/errors'
import type { Empleado, EmpleadoInput } from '../types/empleado'

const emptyForm: EmpleadoInput = {
  tipoDocumento: 'DNI',
  numeroDocumento: '',
  nombres: '',
  apellidos: '',
  telefono: '',
  correo: '',
  cargo: '',
  fechaIngreso: '',
  activo: true,
}

export function Empleados() {
  const [empleados, setEmpleados] = useState<Empleado[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Empleado | null>(null)
  const [form, setForm] = useState<EmpleadoInput>(emptyForm)
  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      setEmpleados(await empleadosService.list())
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudieron cargar los empleados'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setFormError(null)
    setDialogOpen(true)
  }

  const openEdit = (empleado: Empleado) => {
    setEditing(empleado)
    setForm({
      tipoDocumento: empleado.tipoDocumento,
      numeroDocumento: empleado.numeroDocumento,
      nombres: empleado.nombres,
      apellidos: empleado.apellidos,
      telefono: empleado.telefono ?? '',
      correo: empleado.correo ?? '',
      cargo: empleado.cargo ?? '',
      fechaIngreso: empleado.fechaIngreso ?? '',
      activo: empleado.activo,
    })
    setFormError(null)
    setDialogOpen(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setFormError(null)
    try {
      const payload: EmpleadoInput = { ...form, fechaIngreso: form.fechaIngreso || undefined }
      if (editing) {
        await empleadosService.update(editing.id, payload)
      } else {
        await empleadosService.create(payload)
      }
      setDialogOpen(false)
      await load()
    } catch (err) {
      setFormError(getErrorMessage(err, 'No se pudo guardar el empleado'))
    } finally {
      setSaving(false)
    }
  }

  const handleDesactivar = async (empleado: Empleado) => {
    if (!confirm(`¿Desactivar a ${empleado.nombres} ${empleado.apellidos}?`)) return
    try {
      await empleadosService.desactivar(empleado.id)
      await load()
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo desactivar el empleado'))
    }
  }

  return (
    <div>
      <PageHeader
        title="Empleados"
        description="Personal del hotel que puede asignarse a tareas de limpieza y mantenimiento."
        action={<Button onClick={openCreate}>Nuevo empleado</Button>}
      />

      {error && <ErrorBanner message={error} />}

      <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
            <tr>
              <th className="px-4 py-3 font-medium">Documento</th>
              <th className="px-4 py-3 font-medium">Nombre</th>
              <th className="px-4 py-3 font-medium">Cargo</th>
              <th className="px-4 py-3 font-medium">Teléfono</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {loading ? (
              <TableSkeleton columns={6} />
            ) : (
              empleados.map((e) => (
                <tr key={e.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/60">
                  <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">
                    {e.tipoDocumento} {e.numeroDocumento}
                  </td>
                  <td className="px-4 py-3 font-medium text-neutral-900 dark:text-neutral-100">
                    {e.nombres} {e.apellidos}
                  </td>
                  <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">{e.cargo || '—'}</td>
                  <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">{e.telefono || '—'}</td>
                  <td className="px-4 py-3">
                    <Badge tone={e.activo ? 'success' : 'neutral'}>{e.activo ? 'Activo' : 'Inactivo'}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" className="px-2 py-1" onClick={() => openEdit(e)}>
                        Editar
                      </Button>
                      {e.activo && (
                        <Button
                          variant="ghost"
                          className="px-2 py-1 text-red-600 dark:text-red-400"
                          onClick={() => handleDesactivar(e)}
                        >
                          Desactivar
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title={editing ? 'Editar empleado' : 'Nuevo empleado'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {formError && <ErrorBanner message={formError} />}

          <div className="grid grid-cols-2 gap-4">
            <Field label="Tipo de documento" htmlFor="tipoDocumento" required>
              <Input
                id="tipoDocumento"
                value={form.tipoDocumento}
                onChange={(e) => setForm({ ...form, tipoDocumento: e.target.value })}
                required
              />
            </Field>
            <Field label="Número de documento" htmlFor="numeroDocumento" required>
              <Input
                id="numeroDocumento"
                value={form.numeroDocumento}
                onChange={(e) => setForm({ ...form, numeroDocumento: e.target.value })}
                required
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Nombres" htmlFor="nombres" required>
              <Input id="nombres" value={form.nombres} onChange={(e) => setForm({ ...form, nombres: e.target.value })} required />
            </Field>
            <Field label="Apellidos" htmlFor="apellidos" required>
              <Input
                id="apellidos"
                value={form.apellidos}
                onChange={(e) => setForm({ ...form, apellidos: e.target.value })}
                required
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Cargo" htmlFor="cargo">
              <Input id="cargo" value={form.cargo} onChange={(e) => setForm({ ...form, cargo: e.target.value })} />
            </Field>
            <Field label="Teléfono" htmlFor="telefono">
              <Input id="telefono" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Correo" htmlFor="correo">
              <Input id="correo" type="email" value={form.correo} onChange={(e) => setForm({ ...form, correo: e.target.value })} />
            </Field>
            <Field label="Fecha de ingreso" htmlFor="fechaIngreso">
              <Input
                id="fechaIngreso"
                type="date"
                value={form.fechaIngreso}
                onChange={(e) => setForm({ ...form, fechaIngreso: e.target.value })}
              />
            </Field>
          </div>

          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Guardando…' : 'Guardar'}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  )
}

import { useEffect, useState, type FormEvent } from 'react'
import { Button } from '../components/ui/Button'
import { Dialog } from '../components/ui/Dialog'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorBanner } from '../components/ui/ErrorBanner'
import { Field } from '../components/ui/Field'
import { Input } from '../components/ui/Input'
import { PageHeader } from '../components/ui/PageHeader'
import { TableSkeleton } from '../components/ui/Skeleton'
import { getErrorMessage } from '../services/errors'
import { huespedesService } from '../services/huespedes'
import type { Huesped, HuespedInput } from '../types'

const emptyForm: HuespedInput = {
  tipoDocumento: 'DNI',
  numeroDocumento: '',
  nombres: '',
  apellidos: '',
  telefono: '',
  correo: '',
  nacionalidad: '',
  direccion: '',
  fechaNacimiento: '',
}

export function Huespedes() {
  const [huespedes, setHuespedes] = useState<Huesped[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Huesped | null>(null)
  const [form, setForm] = useState<HuespedInput>(emptyForm)
  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const load = async (q?: string) => {
    setLoading(true)
    setError(null)
    try {
      setHuespedes(await huespedesService.list(q))
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudieron cargar los huéspedes'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => load(query || undefined), 300)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setFormError(null)
    setDialogOpen(true)
  }

  const openEdit = (huesped: Huesped) => {
    setEditing(huesped)
    setForm({
      tipoDocumento: huesped.tipoDocumento,
      numeroDocumento: huesped.numeroDocumento,
      nombres: huesped.nombres,
      apellidos: huesped.apellidos,
      telefono: huesped.telefono ?? '',
      correo: huesped.correo ?? '',
      nacionalidad: huesped.nacionalidad ?? '',
      direccion: huesped.direccion ?? '',
      fechaNacimiento: huesped.fechaNacimiento ?? '',
    })
    setFormError(null)
    setDialogOpen(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setFormError(null)
    try {
      const payload: HuespedInput = {
        ...form,
        fechaNacimiento: form.fechaNacimiento || undefined,
      }
      if (editing) {
        await huespedesService.update(editing.id, payload)
      } else {
        await huespedesService.create(payload)
      }
      setDialogOpen(false)
      await load(query || undefined)
    } catch (err) {
      setFormError(getErrorMessage(err, 'No se pudo guardar el huésped'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Huéspedes"
        description="Busca y administra los datos de los huéspedes registrados."
        action={<Button onClick={openCreate}>Nuevo huésped</Button>}
      />

      {error && <ErrorBanner message={error} />}

      <div className="mb-4 max-w-sm">
        <Input
          placeholder="Buscar por nombre o apellido…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
            <tr>
              <th className="px-4 py-3 font-medium">Documento</th>
              <th className="px-4 py-3 font-medium">Nombres</th>
              <th className="px-4 py-3 font-medium">Apellidos</th>
              <th className="px-4 py-3 font-medium">Teléfono</th>
              <th className="px-4 py-3 font-medium">Correo</th>
              <th className="px-4 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {loading ? (
              <TableSkeleton columns={6} />
            ) : (
              huespedes.map((h) => (
                <tr key={h.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/60">
                  <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">
                    {h.tipoDocumento} {h.numeroDocumento}
                  </td>
                  <td className="px-4 py-3 font-medium text-neutral-900 dark:text-neutral-100">{h.nombres}</td>
                  <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">{h.apellidos}</td>
                  <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">{h.telefono || '—'}</td>
                  <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">{h.correo || '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" className="px-2 py-1" onClick={() => openEdit(h)}>
                      Editar
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {!loading && huespedes.length === 0 && (
          <EmptyState
            title={query ? 'Sin resultados' : 'Todavía no hay huéspedes'}
            description={
              query
                ? 'No encontramos huéspedes que coincidan con tu búsqueda.'
                : 'Registra el primer huésped para empezar a crear reservas.'
            }
            action={!query && <Button onClick={openCreate}>Nuevo huésped</Button>}
          />
        )}
      </div>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title={editing ? 'Editar huésped' : 'Nuevo huésped'}>
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
              <Input
                id="nombres"
                value={form.nombres}
                onChange={(e) => setForm({ ...form, nombres: e.target.value })}
                required
              />
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
            <Field label="Teléfono" htmlFor="telefono">
              <Input
                id="telefono"
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              />
            </Field>
            <Field label="Correo" htmlFor="correo">
              <Input
                id="correo"
                type="email"
                value={form.correo}
                onChange={(e) => setForm({ ...form, correo: e.target.value })}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Nacionalidad" htmlFor="nacionalidad">
              <Input
                id="nacionalidad"
                value={form.nacionalidad}
                onChange={(e) => setForm({ ...form, nacionalidad: e.target.value })}
              />
            </Field>
            <Field label="Fecha de nacimiento" htmlFor="fechaNacimiento">
              <Input
                id="fechaNacimiento"
                type="date"
                value={form.fechaNacimiento}
                onChange={(e) => setForm({ ...form, fechaNacimiento: e.target.value })}
              />
            </Field>
          </div>

          <Field label="Dirección" htmlFor="direccion">
            <Input
              id="direccion"
              value={form.direccion}
              onChange={(e) => setForm({ ...form, direccion: e.target.value })}
            />
          </Field>

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

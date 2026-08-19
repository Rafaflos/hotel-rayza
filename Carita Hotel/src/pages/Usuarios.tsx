import { useEffect, useState, type FormEvent } from 'react'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Dialog } from '../components/ui/Dialog'
import { ErrorBanner } from '../components/ui/ErrorBanner'
import { Field } from '../components/ui/Field'
import { Input } from '../components/ui/Input'
import { PageHeader } from '../components/ui/PageHeader'
import { TableSkeleton } from '../components/ui/Skeleton'
import { getErrorMessage } from '../services/errors'
import { usuariosService } from '../services/usuarios'
import type { Rol, Usuario, UsuarioInput } from '../types/usuario'

const emptyForm: UsuarioInput = {
  username: '',
  password: '',
  nombres: '',
  apellidos: '',
  correo: '',
  telefono: '',
  activo: true,
  rolesIds: [],
}

export function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [roles, setRoles] = useState<Rol[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Usuario | null>(null)
  const [form, setForm] = useState<UsuarioInput>(emptyForm)
  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const [usuariosData, rolesData] = await Promise.all([usuariosService.list(), usuariosService.roles()])
      setUsuarios(usuariosData)
      setRoles(rolesData)
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudieron cargar los usuarios'))
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

  const openEdit = (usuario: Usuario) => {
    setEditing(usuario)
    setForm({
      username: usuario.username,
      password: '',
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      correo: usuario.correo ?? '',
      telefono: usuario.telefono ?? '',
      activo: usuario.activo,
      rolesIds: usuario.roles.map((r) => r.id),
    })
    setFormError(null)
    setDialogOpen(true)
  }

  const toggleRol = (rolId: number) => {
    setForm((f) => ({
      ...f,
      rolesIds: f.rolesIds.includes(rolId) ? f.rolesIds.filter((id) => id !== rolId) : [...f.rolesIds, rolId],
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (form.rolesIds.length === 0) {
      setFormError('Debe asignar al menos un rol')
      return
    }
    setSaving(true)
    setFormError(null)
    try {
      const payload: UsuarioInput = { ...form, password: form.password || undefined }
      if (editing) {
        await usuariosService.update(editing.id, payload)
      } else {
        await usuariosService.create(payload)
      }
      setDialogOpen(false)
      await load()
    } catch (err) {
      setFormError(getErrorMessage(err, 'No se pudo guardar el usuario'))
    } finally {
      setSaving(false)
    }
  }

  const handleDesactivar = async (usuario: Usuario) => {
    if (!confirm(`¿Desactivar al usuario ${usuario.username}?`)) return
    try {
      await usuariosService.desactivar(usuario.id)
      await load()
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo desactivar el usuario'))
    }
  }

  return (
    <div>
      <PageHeader
        title="Usuarios"
        description="Gestiona el personal con acceso al sistema y sus roles."
        action={<Button onClick={openCreate}>Nuevo usuario</Button>}
      />

      {error && <ErrorBanner message={error} />}

      <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
            <tr>
              <th className="px-4 py-3 font-medium">Usuario</th>
              <th className="px-4 py-3 font-medium">Nombre</th>
              <th className="px-4 py-3 font-medium">Roles</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {loading ? (
              <TableSkeleton columns={5} />
            ) : (
              usuarios.map((u) => (
                <tr key={u.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/60">
                  <td className="px-4 py-3 font-medium text-neutral-900 dark:text-neutral-100">{u.username}</td>
                  <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">
                    {u.nombres} {u.apellidos}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {u.roles.map((r) => (
                        <Badge key={r.id} tone="info">
                          {r.nombre}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={u.activo ? 'success' : 'neutral'}>{u.activo ? 'Activo' : 'Inactivo'}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" className="px-2 py-1" onClick={() => openEdit(u)}>
                        Editar
                      </Button>
                      {u.username !== 'admin' && u.activo && (
                        <Button
                          variant="ghost"
                          className="px-2 py-1 text-red-600 dark:text-red-400"
                          onClick={() => handleDesactivar(u)}
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

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title={editing ? 'Editar usuario' : 'Nuevo usuario'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {formError && <ErrorBanner message={formError} />}

          <div className="grid grid-cols-2 gap-4">
            <Field label="Usuario" htmlFor="username" required>
              <Input
                id="username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </Field>
            <Field label={editing ? 'Nueva contraseña (opcional)' : 'Contraseña'} htmlFor="password" required={!editing}>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder={editing ? 'Dejar vacío para no cambiar' : ''}
                required={!editing}
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
            <Field label="Correo" htmlFor="correo">
              <Input
                id="correo"
                type="email"
                value={form.correo}
                onChange={(e) => setForm({ ...form, correo: e.target.value })}
              />
            </Field>
            <Field label="Teléfono" htmlFor="telefono">
              <Input
                id="telefono"
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              />
            </Field>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Roles <span className="text-red-600 dark:text-red-400">*</span>
            </p>
            <div className="grid grid-cols-2 gap-2">
              {roles.map((rol) => (
                <label key={rol.id} className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                  <input
                    type="checkbox"
                    checked={form.rolesIds.includes(rol.id)}
                    onChange={() => toggleRol(rol.id)}
                    className="h-4 w-4 rounded border-neutral-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-900"
                  />
                  {rol.nombre}
                </label>
              ))}
            </div>
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

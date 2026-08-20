import { useEffect, useState, type FormEvent } from 'react'
import { Badge, type Tone } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Dialog, DialogFooter } from '../components/ui/Dialog'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorBanner } from '../components/ui/ErrorBanner'
import { Field } from '../components/ui/Field'
import { Input } from '../components/ui/Input'
import { PageHeader } from '../components/ui/PageHeader'
import { Panel } from '../components/ui/Panel'
import { Select } from '../components/ui/Select'
import { IconAvisos, IconCheck, IconPlus } from '../components/ui/icons'
import { getErrorMessage } from '../services/errors'
import { habitacionesService } from '../services/habitaciones'
import { avisosService } from '../services/operacion'
import type { Aviso, CategoriaAviso, PrioridadAviso } from '../types/operacion'
import type { Habitacion } from '../types'
import { fechaHoraCorta } from '../utils/formato'

const categorias: { id: CategoriaAviso; label: string; tone: Tone }[] = [
  { id: 'GENERAL', label: 'General', tone: 'neutral' },
  { id: 'LIMPIEZA', label: 'Limpieza', tone: 'info' },
  { id: 'CAJA', label: 'Caja', tone: 'success' },
  { id: 'MANTENIMIENTO', label: 'Mantenimiento', tone: 'warning' },
  { id: 'TURNO', label: 'Turno', tone: 'neutral' },
]

const tonoDe = (c: CategoriaAviso) => categorias.find((x) => x.id === c)?.tone ?? 'neutral'
const labelDe = (c: CategoriaAviso) => categorias.find((x) => x.id === c)?.label ?? c

export function Avisos() {
  const [avisos, setAvisos] = useState<Aviso[]>([])
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filtro, setFiltro] = useState<CategoriaAviso | 'TODOS' | 'PENDIENTES'>('PENDIENTES')

  const [dialogOpen, setDialogOpen] = useState(false)
  const [categoria, setCategoria] = useState<CategoriaAviso>('GENERAL')
  const [asunto, setAsunto] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [prioridad, setPrioridad] = useState<PrioridadAviso>('NORMAL')
  const [habitacionId, setHabitacionId] = useState(0)
  const [formError, setFormError] = useState<string | null>(null)
  const [guardando, setGuardando] = useState(false)

  const cargar = async () => {
    setLoading(true)
    setError(null)
    try {
      const categoriaParam = filtro !== 'TODOS' && filtro !== 'PENDIENTES' ? filtro : undefined
      const data = await avisosService.list(categoriaParam, filtro === 'PENDIENTES')
      setAvisos(data)
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudieron cargar los avisos'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtro])

  useEffect(() => {
    habitacionesService
      .list()
      .then(setHabitaciones)
      .catch(() => setHabitaciones([]))
  }, [])

  const abrirDialogo = () => {
    setCategoria('GENERAL')
    setAsunto('')
    setMensaje('')
    setPrioridad('NORMAL')
    setHabitacionId(0)
    setFormError(null)
    setDialogOpen(true)
  }

  const publicar = async (e: FormEvent) => {
    e.preventDefault()
    setGuardando(true)
    setFormError(null)
    try {
      await avisosService.create({
        categoria,
        asunto,
        mensaje,
        prioridad,
        habitacionId: habitacionId || undefined,
      })
      setDialogOpen(false)
      await cargar()
    } catch (err) {
      setFormError(getErrorMessage(err, 'No se pudo publicar el aviso'))
    } finally {
      setGuardando(false)
    }
  }

  const marcarLeido = async (aviso: Aviso) => {
    if (aviso.leido) return
    try {
      await avisosService.marcarLeido(aviso.id)
      setAvisos((prev) => prev.map((a) => (a.id === aviso.id ? { ...a, leido: true } : a)))
    } catch {
      // Marcar como leído es secundario: no interrumpe al usuario si falla.
    }
  }

  const resolver = async (id: number) => {
    try {
      await avisosService.resolver(id)
      await cargar()
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo marcar como resuelto'))
    }
  }

  const filtros: { id: typeof filtro; label: string }[] = [
    { id: 'PENDIENTES', label: 'Pendientes' },
    { id: 'TODOS', label: 'Todos' },
    ...categorias.map((c) => ({ id: c.id as typeof filtro, label: c.label })),
  ]

  return (
    <div>
      <PageHeader
        title="Avisos del personal"
        description="Mensajes internos para coordinar entre turnos, limpieza y caja."
        action={
          <Button onClick={abrirDialogo}>
            <IconPlus className="size-4" />
            Nuevo aviso
          </Button>
        }
      />

      {error && <ErrorBanner message={error} />}

      <div className="mb-4 flex flex-wrap items-center gap-1">
        {filtros.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFiltro(f.id)}
            className={`rounded-lg px-3 py-1.5 text-[13px] transition-colors duration-150 ${
              filtro === f.id
                ? 'bg-brand-soft font-medium text-brand-ink'
                : 'text-ink-2 hover:bg-surface hover:text-ink'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col gap-2.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-[var(--radius-card)] border border-line bg-surface px-4 py-4">
              <div className="h-3.5 w-1/3 animate-pulse rounded bg-line" />
              <div className="mt-2.5 h-3 w-3/4 animate-pulse rounded bg-line" />
            </div>
          ))}
        </div>
      ) : avisos.length === 0 ? (
        <Panel>
          <EmptyState
            icon={<IconAvisos className="size-5" />}
            title="No hay avisos por aquí"
            description="Publica un aviso para dejarle un mensaje al siguiente turno o pedir algo a limpieza."
            action={<Button onClick={abrirDialogo}>Nuevo aviso</Button>}
          />
        </Panel>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {avisos.map((a) => (
            <li key={a.id}>
              <article
                onMouseEnter={() => marcarLeido(a)}
                className={`rounded-[var(--radius-card)] border bg-surface px-4 py-3.5 transition-colors duration-150 ${
                  a.leido ? 'border-line' : 'border-brand/35'
                } ${a.resuelto ? 'opacity-65' : ''}`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  {!a.leido && !a.resuelto && (
                    <span className="size-1.5 shrink-0 rounded-full bg-brand" aria-label="Sin leer" />
                  )}
                  <h3 className={`text-[14px] text-ink ${a.leido ? 'font-medium' : 'font-semibold'}`}>
                    {a.asunto}
                  </h3>
                  <Badge tone={tonoDe(a.categoria)}>{labelDe(a.categoria)}</Badge>
                  {a.prioridad === 'ALTA' && <Badge tone="danger">Urgente</Badge>}
                  {a.habitacionNumero && <Badge tone="neutral">Hab. {a.habitacionNumero}</Badge>}
                  {a.resuelto && <Badge tone="success">Resuelto</Badge>}
                  <span className="ml-auto shrink-0 text-[12px] tabular-nums text-ink-3">
                    {fechaHoraCorta(a.fechaHora)}
                  </span>
                </div>

                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-2">{a.mensaje}</p>

                <div className="mt-2.5 flex items-center gap-3">
                  <span className="text-[12px] text-ink-3">{a.autor ?? 'Sistema'}</span>
                  {!a.resuelto && (
                    <Button size="sm" variant="ghost" className="ml-auto" onClick={() => resolver(a.id)}>
                      <IconCheck className="size-3.5" />
                      Marcar resuelto
                    </Button>
                  )}
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title="Nuevo aviso">
        <form onSubmit={publicar} className="flex flex-col gap-4">
          {formError && <ErrorBanner message={formError} />}

          <div className="grid grid-cols-2 gap-4">
            <Field label="Categoría" htmlFor="categoria" required>
              <Select
                id="categoria"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value as CategoriaAviso)}
              >
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Prioridad" htmlFor="prioridad" required>
              <Select
                id="prioridad"
                value={prioridad}
                onChange={(e) => setPrioridad(e.target.value as PrioridadAviso)}
              >
                <option value="NORMAL">Normal</option>
                <option value="ALTA">Urgente</option>
              </Select>
            </Field>
          </div>

          <Field label="Asunto" htmlFor="asunto" required>
            <Input
              id="asunto"
              value={asunto}
              onChange={(e) => setAsunto(e.target.value)}
              placeholder="Ej. Falta reponer toallas en la 101"
              required
            />
          </Field>

          <Field label="Mensaje" htmlFor="mensaje" required>
            <textarea
              id="mensaje"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              rows={3}
              required
              className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink
 placeholder:text-ink-3 transition-[border-color,box-shadow] duration-150 hover:border-line-strong
 focus:border-brand focus:outline-none focus:ring-[3px] focus:ring-brand/18"
            />
          </Field>

          <Field label="Habitación (opcional)" htmlFor="habitacionId">
            <Select
              id="habitacionId"
              value={habitacionId}
              onChange={(e) => setHabitacionId(Number(e.target.value))}
            >
              <option value={0}>No aplica</option>
              {habitaciones.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.numero}
                </option>
              ))}
            </Select>
          </Field>

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={guardando || !asunto || !mensaje}>
              {guardando ? 'Publicando…' : 'Publicar aviso'}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  )
}

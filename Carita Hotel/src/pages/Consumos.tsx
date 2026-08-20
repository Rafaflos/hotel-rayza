import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Button } from '../components/ui/Button'
import { ErrorBanner } from '../components/ui/ErrorBanner'
import { Field } from '../components/ui/Field'
import { Input } from '../components/ui/Input'
import { PageHeader } from '../components/ui/PageHeader'
import { Select } from '../components/ui/Select'
import { consumosService } from '../services/consumos'
import { getErrorMessage } from '../services/errors'
import { reservasService } from '../services/reservas'
import type { Consumo, Reserva, Servicio } from '../types'

export function Consumos() {
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [servicios, setServicios] = useState<Servicio[]>([])
  const [reservaId, setReservaId] = useState<number>(0)
  const [consumos, setConsumos] = useState<Consumo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [servicioId, setServicioId] = useState<number>(0)
  const [descripcion, setDescripcion] = useState('')
  const [cantidad, setCantidad] = useState(1)
  const [precioUnitario, setPrecioUnitario] = useState(0)
  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const enCurso = useMemo(() => reservas.filter((r) => r.estado === 'CHECK_IN'), [reservas])
  const total = useMemo(() => consumos.reduce((sum, c) => sum + c.subtotal, 0), [consumos])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const [reservasData, serviciosData] = await Promise.all([reservasService.list(), consumosService.servicios()])
        setReservas(reservasData)
        setServicios(serviciosData)
      } catch (err) {
        setError(getErrorMessage(err, 'No se pudieron cargar los datos'))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const loadConsumos = async (id: number) => {
    if (!id) {
      setConsumos([])
      return
    }
    try {
      setConsumos(await consumosService.byReserva(id))
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudieron cargar los consumos'))
    }
  }

  useEffect(() => {
    loadConsumos(reservaId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reservaId])

  const handleServicioChange = (id: number) => {
    setServicioId(id)
    const servicio = servicios.find((s) => s.id === id)
    if (servicio) {
      setDescripcion(servicio.nombre.charAt(0) + servicio.nombre.slice(1).toLowerCase())
      if (servicio.precio > 0) setPrecioUnitario(servicio.precio)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!reservaId) return
    setSaving(true)
    setFormError(null)
    try {
      await consumosService.create({
        reservaId,
        servicioId: servicioId || undefined,
        descripcion,
        cantidad,
        precioUnitario,
      })
      setDescripcion('')
      setCantidad(1)
      setPrecioUnitario(0)
      setServicioId(0)
      await loadConsumos(reservaId)
    } catch (err) {
      setFormError(getErrorMessage(err, 'No se pudo registrar el consumo'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader title="Consumos" description="Registra consumos y servicios adicionales durante la estadía." />

      {error && <ErrorBanner message={error} />}

      <div className="mb-6 max-w-sm">
        <Field label="Reserva (en curso)" htmlFor="reservaId">
          <Select id="reservaId" value={reservaId} disabled={loading} onChange={(e) => setReservaId(Number(e.target.value))}>
            <option value={0}>Selecciona una reserva</option>
            {enCurso.map((r) => (
              <option key={r.id} value={r.id}>
                {r.codigo} — {r.huespedPrincipal.nombres} {r.huespedPrincipal.apellidos} (hab. {r.habitacion.numero})
              </option>
            ))}
          </Select>
        </Field>
      </div>

      {reservaId > 0 && (
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex-1">
            <div className="mb-4 rounded-lg border border-line p-4">
              <p className="text-xs text-ink-3">Total de consumos</p>
              <p className="mt-1 text-lg font-semibold tabular-nums text-ink">S/ {total.toFixed(2)}</p>
            </div>

            <div className="overflow-x-auto rounded-lg border border-line">
              <table className="w-full text-left text-sm">
                <thead className="bg-canvas text-xs uppercase tracking-wide text-ink-3">
                  <tr>
                    <th className="px-4 py-3 font-medium">Fecha</th>
                    <th className="px-4 py-3 font-medium">Descripción</th>
                    <th className="px-4 py-3 font-medium">Cant.</th>
                    <th className="px-4 py-3 font-medium">P. unit.</th>
                    <th className="px-4 py-3 font-medium">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {consumos.map((c) => (
                    <tr key={c.id}>
                      <td className="px-4 py-3 text-ink-2">{c.fechaHora.slice(0, 16).replace('T', ' ')}</td>
                      <td className="px-4 py-3 text-ink-2">{c.descripcion}</td>
                      <td className="px-4 py-3 tabular-nums text-ink-2">{c.cantidad}</td>
                      <td className="px-4 py-3 tabular-nums text-ink-2">S/ {c.precioUnitario.toFixed(2)}</td>
                      <td className="px-4 py-3 tabular-nums text-ink-2">S/ {c.subtotal.toFixed(2)}</td>
                    </tr>
                  ))}
                  {consumos.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-ink-3">
                        Todavía no hay consumos registrados para esta reserva.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4 lg:w-72">
            <h3 className="text-sm font-medium text-ink">Registrar consumo</h3>
            {formError && <ErrorBanner message={formError} />}

            <Field label="Servicio (opcional)" htmlFor="servicioId">
              <Select id="servicioId" value={servicioId} onChange={(e) => handleServicioChange(Number(e.target.value))}>
                <option value={0}>Otro / manual</option>
                {servicios.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Descripción" htmlFor="descripcion" required>
              <Input id="descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Cantidad" htmlFor="cantidad" required>
                <Input
                  id="cantidad"
                  type="number"
                  min={0.01}
                  step="0.01"
                  value={cantidad}
                  onChange={(e) => setCantidad(Number(e.target.value))}
                  required
                />
              </Field>
              <Field label="Precio unit. (S/)" htmlFor="precioUnitario" required>
                <Input
                  id="precioUnitario"
                  type="number"
                  min={0}
                  step="0.01"
                  value={precioUnitario}
                  onChange={(e) => setPrecioUnitario(Number(e.target.value))}
                  required
                />
              </Field>
            </div>

            <Button type="submit" disabled={saving || !descripcion || cantidad <= 0}>
              {saving ? 'Registrando…' : 'Registrar consumo'}
            </Button>
          </form>
        </div>
      )}
    </div>
  )
}

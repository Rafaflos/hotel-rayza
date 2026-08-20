import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Button } from '../components/ui/Button'
import { ErrorBanner } from '../components/ui/ErrorBanner'
import { Field } from '../components/ui/Field'
import { Input } from '../components/ui/Input'
import { PageHeader } from '../components/ui/PageHeader'
import { Select } from '../components/ui/Select'
import { getErrorMessage } from '../services/errors'
import { pagosService } from '../services/pagos'
import { reservasService } from '../services/reservas'
import type { MetodoPago, Pago, Reserva } from '../types'

export function Pagos() {
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [metodos, setMetodos] = useState<MetodoPago[]>([])
  const [reservaId, setReservaId] = useState<number>(0)
  const [pagos, setPagos] = useState<Pago[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [metodoPagoId, setMetodoPagoId] = useState<number>(0)
  const [monto, setMonto] = useState(0)
  const [referencia, setReferencia] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const reservaSeleccionada = useMemo(() => reservas.find((r) => r.id === reservaId) ?? null, [reservas, reservaId])
  const totalPagado = useMemo(() => pagos.filter((p) => p.estado === 'CONFIRMADO').reduce((sum, p) => sum + p.monto, 0), [pagos])
  const saldoPendiente = reservaSeleccionada ? Math.max(reservaSeleccionada.total - totalPagado, 0) : 0

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const [reservasData, metodosData] = await Promise.all([reservasService.list(), pagosService.metodos()])
        setReservas(reservasData.filter((r) => r.estado !== 'CANCELADA' && r.estado !== 'NO_SHOW'))
        setMetodos(metodosData)
        setMetodoPagoId(metodosData[0]?.id ?? 0)
      } catch (err) {
        setError(getErrorMessage(err, 'No se pudieron cargar los datos'))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const loadPagos = async (id: number) => {
    if (!id) {
      setPagos([])
      return
    }
    try {
      setPagos(await pagosService.byReserva(id))
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudieron cargar los pagos'))
    }
  }

  useEffect(() => {
    loadPagos(reservaId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reservaId])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!reservaId || !metodoPagoId) return
    setSaving(true)
    setFormError(null)
    try {
      await pagosService.create({ reservaId, metodoPagoId, monto, referencia: referencia || undefined })
      setMonto(0)
      setReferencia('')
      await loadPagos(reservaId)
    } catch (err) {
      setFormError(getErrorMessage(err, 'No se pudo registrar el pago'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader title="Pagos" description="Registra pagos contra una reserva y revisa el saldo pendiente." />

      {error && <ErrorBanner message={error} />}

      <div className="mb-6 max-w-sm">
        <Field label="Reserva" htmlFor="reservaId">
          <Select
            id="reservaId"
            value={reservaId}
            disabled={loading}
            onChange={(e) => setReservaId(Number(e.target.value))}
          >
            <option value={0}>Selecciona una reserva</option>
            {reservas.map((r) => (
              <option key={r.id} value={r.id}>
                {r.codigo} — {r.huespedPrincipal.nombres} {r.huespedPrincipal.apellidos}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      {reservaSeleccionada && (
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex-1">
            <div className="mb-4 grid grid-cols-3 gap-4">
              <div className="rounded-lg border border-line p-4">
                <p className="text-xs text-ink-3">Total reserva</p>
                <p className="mt-1 text-lg font-semibold tabular-nums text-ink">
                  S/ {reservaSeleccionada.total.toFixed(2)}
                </p>
              </div>
              <div className="rounded-lg border border-line p-4">
                <p className="text-xs text-ink-3">Pagado</p>
                <p className="mt-1 text-lg font-semibold tabular-nums text-ok">
                  S/ {totalPagado.toFixed(2)}
                </p>
              </div>
              <div className="rounded-lg border border-line p-4">
                <p className="text-xs text-ink-3">Saldo pendiente</p>
                <p className="mt-1 text-lg font-semibold tabular-nums text-ink">
                  S/ {saldoPendiente.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-line">
              <table className="w-full text-left text-sm">
                <thead className="bg-canvas text-xs uppercase tracking-wide text-ink-3">
                  <tr>
                    <th className="px-4 py-3 font-medium">Fecha</th>
                    <th className="px-4 py-3 font-medium">Método</th>
                    <th className="px-4 py-3 font-medium">Monto</th>
                    <th className="px-4 py-3 font-medium">Referencia</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {pagos.map((p) => (
                    <tr key={p.id}>
                      <td className="px-4 py-3 text-ink-2">{p.fechaHora.slice(0, 16).replace('T', ' ')}</td>
                      <td className="px-4 py-3 text-ink-2">{p.metodoPago}</td>
                      <td className="px-4 py-3 tabular-nums text-ink-2">S/ {p.monto.toFixed(2)}</td>
                      <td className="px-4 py-3 text-ink-2">{p.referencia || '—'}</td>
                    </tr>
                  ))}
                  {pagos.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-ink-3">
                        Todavía no hay pagos registrados para esta reserva.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4 lg:w-72">
            <h3 className="text-sm font-medium text-ink">Registrar pago</h3>
            {formError && <ErrorBanner message={formError} />}

            <Field label="Método de pago" htmlFor="metodoPagoId" required>
              <Select id="metodoPagoId" value={metodoPagoId} onChange={(e) => setMetodoPagoId(Number(e.target.value))} required>
                {metodos.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nombre}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Monto (S/)" htmlFor="monto" required>
              <Input
                id="monto"
                type="number"
                min={0.01}
                step="0.01"
                value={monto}
                onChange={(e) => setMonto(Number(e.target.value))}
                required
              />
            </Field>

            <Field label="Referencia" htmlFor="referencia">
              <Input id="referencia" value={referencia} onChange={(e) => setReferencia(e.target.value)} />
            </Field>

            <Button type="submit" disabled={saving || monto <= 0}>
              {saving ? 'Registrando…' : 'Registrar pago'}
            </Button>
          </form>
        </div>
      )}
    </div>
  )
}

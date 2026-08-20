import { useEffect, useState, type FormEvent } from 'react'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Dialog } from '../components/ui/Dialog'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorBanner } from '../components/ui/ErrorBanner'
import { Field } from '../components/ui/Field'
import { Input } from '../components/ui/Input'
import { PageHeader } from '../components/ui/PageHeader'
import { StatCard } from '../components/ui/StatCard'
import { cajasService } from '../services/cajas'
import { getErrorMessage } from '../services/errors'
import type { Caja as CajaType, MovimientoCaja } from '../types'
import { estadoCajaInfo } from '../utils/estado'

export function Caja() {
  const [caja, setCaja] = useState<CajaType | null>(null)
  const [movimientos, setMovimientos] = useState<MovimientoCaja[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [abrirOpen, setAbrirOpen] = useState(false)
  const [montoInicial, setMontoInicial] = useState(0)
  const [observacionesApertura, setObservacionesApertura] = useState('')

  const [cerrarOpen, setCerrarOpen] = useState(false)
  const [montoContado, setMontoContado] = useState(0)
  const [observacionesCierre, setObservacionesCierre] = useState('')

  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const abierta = await cajasService.abierta();
      setCaja(abierta)
      setMovimientos(await cajasService.movimientos(abierta.id))
    } catch {
      setCaja(null)
      setMovimientos([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleAbrir = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setFormError(null)
    try {
      await cajasService.abrir(montoInicial, observacionesApertura || undefined)
      setAbrirOpen(false)
      setMontoInicial(0)
      setObservacionesApertura('')
      await load()
    } catch (err) {
      setFormError(getErrorMessage(err, 'No se pudo abrir la caja'))
    } finally {
      setSaving(false)
    }
  }

  const handleCerrar = async (e: FormEvent) => {
    e.preventDefault()
    if (!caja) return
    setSaving(true)
    setFormError(null)
    try {
      await cajasService.cerrar(caja.id, montoContado, observacionesCierre || undefined)
      setCerrarOpen(false)
      setMontoContado(0)
      setObservacionesCierre('')
      await load()
    } catch (err) {
      setFormError(getErrorMessage(err, 'No se pudo cerrar la caja'))
    } finally {
      setSaving(false)
    }
  }

  const montoEsperado = caja ? caja.montoInicial + caja.totalIngresos - caja.totalEgresos : 0

  return (
    <div>
      <PageHeader
        title="Caja"
        description="Apertura, cierre y movimientos de caja del turno actual."
        action={
          !loading &&
          (caja ? (
            <Button variant="danger" onClick={() => setCerrarOpen(true)}>
              Cerrar caja
            </Button>
          ) : (
            <Button onClick={() => setAbrirOpen(true)}>Abrir caja</Button>
          ))
        }
      />

      {error && <ErrorBanner message={error} />}

      {!loading && !caja && (
        <EmptyState
          title="No hay una caja abierta"
          description="Abre una caja para poder registrar pagos e ingresos."
          action={<Button onClick={() => setAbrirOpen(true)}>Abrir caja</Button>}
        />
      )}

      {caja && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <Badge tone={estadoCajaInfo[caja.estado].tone}>{estadoCajaInfo[caja.estado].label}</Badge>
            <span className="text-sm text-ink-3">
              Abierta por {caja.usuarioApertura ?? '—'} el {caja.fechaApertura.slice(0, 16).replace('T', ' ')}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard label="Monto inicial" value={`S/ ${caja.montoInicial.toFixed(2)}`} />
            <StatCard label="Ingresos" value={`S/ ${caja.totalIngresos.toFixed(2)}`} />
            <StatCard label="Egresos" value={`S/ ${caja.totalEgresos.toFixed(2)}`} />
            <StatCard label="Esperado en caja" value={`S/ ${montoEsperado.toFixed(2)}`} />
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium text-ink-3">Movimientos</h3>
            <div className="overflow-x-auto rounded-lg border border-line">
              <table className="w-full text-left text-sm">
                <thead className="bg-canvas text-xs uppercase tracking-wide text-ink-3">
                  <tr>
                    <th className="px-4 py-3 font-medium">Fecha</th>
                    <th className="px-4 py-3 font-medium">Tipo</th>
                    <th className="px-4 py-3 font-medium">Concepto</th>
                    <th className="px-4 py-3 font-medium text-right">Monto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {movimientos.map((m) => (
                    <tr key={m.id}>
                      <td className="px-4 py-3 text-ink-2">{m.fechaHora.slice(0, 16).replace('T', ' ')}</td>
                      <td className="px-4 py-3">
                        <Badge tone={m.tipo === 'INGRESO' ? 'success' : 'danger'}>{m.tipo === 'INGRESO' ? 'Ingreso' : 'Egreso'}</Badge>
                      </td>
                      <td className="px-4 py-3 text-ink-2">{m.concepto}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-ink-2">
                        S/ {m.monto.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  {movimientos.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-ink-3">
                        Todavía no hay movimientos en este turno.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <Dialog open={abrirOpen} onClose={() => setAbrirOpen(false)} title="Abrir caja">
        <form onSubmit={handleAbrir} className="flex flex-col gap-4">
          {formError && <ErrorBanner message={formError} />}
          <Field label="Monto inicial (S/)" htmlFor="montoInicial" required>
            <Input
              id="montoInicial"
              type="number"
              min={0}
              step="0.01"
              value={montoInicial}
              onChange={(e) => setMontoInicial(Number(e.target.value))}
              required
            />
          </Field>
          <Field label="Observaciones" htmlFor="observacionesApertura">
            <Input
              id="observacionesApertura"
              value={observacionesApertura}
              onChange={(e) => setObservacionesApertura(e.target.value)}
            />
          </Field>
          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setAbrirOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Abriendo…' : 'Abrir caja'}
            </Button>
          </div>
        </form>
      </Dialog>

      <Dialog open={cerrarOpen} onClose={() => setCerrarOpen(false)} title="Cerrar caja">
        <form onSubmit={handleCerrar} className="flex flex-col gap-4">
          {formError && <ErrorBanner message={formError} />}
          {caja && (
            <p className="text-sm text-ink-2">
              Monto esperado en caja: <span className="font-semibold text-ink">S/ {montoEsperado.toFixed(2)}</span>
            </p>
          )}
          <Field label="Monto contado (S/)" htmlFor="montoContado" required>
            <Input
              id="montoContado"
              type="number"
              min={0}
              step="0.01"
              value={montoContado}
              onChange={(e) => setMontoContado(Number(e.target.value))}
              required
            />
          </Field>
          <Field label="Observaciones" htmlFor="observacionesCierre">
            <Input
              id="observacionesCierre"
              value={observacionesCierre}
              onChange={(e) => setObservacionesCierre(e.target.value)}
            />
          </Field>
          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setCerrarOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="danger" disabled={saving}>
              {saving ? 'Cerrando…' : 'Cerrar caja'}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Button } from '../components/ui/Button'
import { ErrorBanner } from '../components/ui/ErrorBanner'
import { Field } from '../components/ui/Field'
import { Input } from '../components/ui/Input'
import { PageHeader } from '../components/ui/PageHeader'
import { StatCard } from '../components/ui/StatCard'
import { getErrorMessage } from '../services/errors'
import { reportesService } from '../services/reportes'
import type { ReporteResumen } from '../types'
import { estadoCajaInfo } from '../utils/estado'
import { Badge } from '../components/ui/Badge'

const today = new Date().toISOString().slice(0, 10)
const firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10)

export function Reportes() {
  const [desde, setDesde] = useState(firstOfMonth)
  const [hasta, setHasta] = useState(today)
  const [resumen, setResumen] = useState<ReporteResumen | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      setResumen(await reportesService.resumen(desde, hasta))
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo cargar el reporte'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleExport = async (formato: 'csv' | 'xlsx' | 'pdf') => {
    setExporting(true)
    setError(null)
    try {
      if (formato === 'csv') await reportesService.descargarReservasCsv(desde, hasta)
      else if (formato === 'xlsx') await reportesService.descargarReservasExcel(desde, hasta)
      else await reportesService.descargarResumenPdf(desde, hasta)
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo exportar el reporte'))
    } finally {
      setExporting(false)
    }
  }

  return (
    <div>
      <PageHeader title="Reportes" description="Resumen de ocupación, reservas, ingresos y caja por rango de fechas." />

      {error && <ErrorBanner message={error} />}

      <div className="mb-6 flex flex-wrap items-end gap-4">
        <Field label="Desde" htmlFor="desde">
          <Input id="desde" type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
        </Field>
        <Field label="Hasta" htmlFor="hasta">
          <Input id="hasta" type="date" min={desde} value={hasta} onChange={(e) => setHasta(e.target.value)} />
        </Field>
        <Button onClick={load} disabled={loading}>
          {loading ? 'Cargando…' : 'Actualizar'}
        </Button>
        <Button variant="secondary" onClick={() => handleExport('pdf')} disabled={exporting}>
          Resumen PDF
        </Button>
        <Button variant="secondary" onClick={() => handleExport('xlsx')} disabled={exporting}>
          Reservas Excel
        </Button>
        <Button variant="secondary" onClick={() => handleExport('csv')} disabled={exporting}>
          Reservas CSV
        </Button>
      </div>

      {resumen && (
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="mb-3 text-sm font-medium text-ink-3">General</h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              <StatCard label="Habitaciones" value={resumen.totalHabitaciones} />
              <StatCard label="Ocupadas ahora" value={resumen.habitacionesOcupadasActual} />
              <StatCard label="Reservas" value={resumen.totalReservas} />
              <StatCard label="Cancelaciones" value={resumen.cancelaciones} />
              <StatCard label="Check-in" value={resumen.checkins} />
              <StatCard label="Check-out" value={resumen.checkouts} />
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium text-ink-3">Ingresos</h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatCard label="Total" value={`S/ ${resumen.ingresosTotal.toFixed(2)}`} />
              {Object.entries(resumen.ingresosPorMetodo).map(([metodo, monto]) => (
                <StatCard key={metodo} label={metodo} value={`S/ ${monto.toFixed(2)}`} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium text-ink-3">Reservas por estado</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(resumen.reservasPorEstado).map(([estado, cantidad]) => (
                <span
                  key={estado}
                  className="rounded-md border border-line px-3 py-1.5 text-sm text-ink-2"
                >
                  {estado}: <span className="font-semibold">{cantidad}</span>
                </span>
              ))}
              {Object.keys(resumen.reservasPorEstado).length === 0 && (
                <p className="text-sm text-ink-3">Sin reservas en este rango.</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium text-ink-3">Caja</h3>
            <div className="overflow-x-auto rounded-lg border border-line">
              <table className="w-full text-left text-sm">
                <thead className="bg-canvas text-xs uppercase tracking-wide text-ink-3">
                  <tr>
                    <th className="px-4 py-3 font-medium">Fecha</th>
                    <th className="px-4 py-3 font-medium">Apertura</th>
                    <th className="px-4 py-3 font-medium">Ingresos</th>
                    <th className="px-4 py-3 font-medium">Egresos</th>
                    <th className="px-4 py-3 font-medium">Diferencia</th>
                    <th className="px-4 py-3 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {resumen.cajas.map((c) => (
                    <tr key={c.id}>
                      <td className="px-4 py-3 text-ink-2">{c.fecha}</td>
                      <td className="px-4 py-3 text-ink-2">{c.usuarioApertura ?? '—'}</td>
                      <td className="px-4 py-3 tabular-nums text-ink-2">S/ {c.totalIngresos.toFixed(2)}</td>
                      <td className="px-4 py-3 tabular-nums text-ink-2">S/ {c.totalEgresos.toFixed(2)}</td>
                      <td className="px-4 py-3 tabular-nums text-ink-2">
                        {c.diferencia != null ? `S/ ${c.diferencia.toFixed(2)}` : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <Badge tone={estadoCajaInfo[c.estado].tone}>{estadoCajaInfo[c.estado].label}</Badge>
                      </td>
                    </tr>
                  ))}
                  {resumen.cajas.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center text-ink-3">
                        No hubo turnos de caja en este rango.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

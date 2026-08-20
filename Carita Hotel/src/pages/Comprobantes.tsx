import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Dialog } from '../components/ui/Dialog'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorBanner } from '../components/ui/ErrorBanner'
import { Field } from '../components/ui/Field'
import { PageHeader } from '../components/ui/PageHeader'
import { Select } from '../components/ui/Select'
import { TableSkeleton } from '../components/ui/Skeleton'
import { comprobantesService } from '../services/comprobantes'
import { getErrorMessage } from '../services/errors'
import { reservasService } from '../services/reservas'
import type { Comprobante, Reserva, TipoComprobante } from '../types'
import { estadoComprobanteInfo } from '../utils/estado'

export function Comprobantes() {
  const [comprobantes, setComprobantes] = useState<Comprobante[]>([])
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionId, setActionId] = useState<number | null>(null)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [reservaId, setReservaId] = useState(0)
  const [tipo, setTipo] = useState<TipoComprobante>('BOLETA')
  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [emitido, setEmitido] = useState<Comprobante | null>(null)

  const conCheckout = useMemo(() => reservas.filter((r) => r.estado === 'CHECK_OUT'), [reservas])

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const [comprobantesData, reservasData] = await Promise.all([comprobantesService.list(), reservasService.list()])
      setComprobantes(comprobantesData)
      setReservas(reservasData)
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudieron cargar los comprobantes'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const openDialog = () => {
    setReservaId(0)
    setTipo('BOLETA')
    setFormError(null)
    setEmitido(null)
    setDialogOpen(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!reservaId) return
    setSaving(true)
    setFormError(null)
    try {
      const checkout = await comprobantesService.checkoutByReserva(reservaId)
      const comprobante = await comprobantesService.create({ checkoutId: checkout.id, tipo })
      setEmitido(comprobante)
      await load()
    } catch (err) {
      setFormError(getErrorMessage(err, 'No se pudo emitir el comprobante'))
    } finally {
      setSaving(false)
    }
  }

  const handleAnular = async (id: number) => {
    const motivo = prompt('Motivo de la anulación (obligatorio para SUNAT):')
    if (!motivo) return
    setActionId(id)
    try {
      await comprobantesService.anular(id, motivo)
      await load()
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo anular el comprobante'))
    } finally {
      setActionId(null)
    }
  }

  return (
    <div>
      <PageHeader
        title="Comprobantes"
        description="Emite boletas, facturas o recibos a partir de un check-out."
        action={<Button onClick={openDialog}>Emitir comprobante</Button>}
      />

      {error && <ErrorBanner message={error} />}

      <div className="overflow-x-auto rounded-lg border border-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-canvas text-xs uppercase tracking-wide text-ink-3">
            <tr>
              <th className="px-4 py-3 font-medium">N°</th>
              <th className="px-4 py-3 font-medium">Tipo</th>
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">Reserva</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium">SUNAT</th>
              <th className="px-4 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {loading ? (
              <TableSkeleton columns={8} />
            ) : (
              comprobantes.map((c) => (
                <tr key={c.id} className="hover:bg-canvas/60">
                  <td className="px-4 py-3 font-medium text-ink">
                    {c.serie}-{c.numero}
                  </td>
                  <td className="px-4 py-3 text-ink-2">{c.tipo}</td>
                  <td className="px-4 py-3 text-ink-2">{c.clienteNombre}</td>
                  <td className="px-4 py-3 text-ink-2">{c.reservaCodigo}</td>
                  <td className="px-4 py-3 tabular-nums text-ink-2">S/ {c.total.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <Badge tone={estadoComprobanteInfo[c.estado].tone}>{estadoComprobanteInfo[c.estado].label}</Badge>
                  </td>
                  <td className="px-4 py-3 text-ink-2">
                    {c.sunatAceptada === true && c.sunatEnlacePdf ? (
                      <a href={c.sunatEnlacePdf} target="_blank" rel="noreferrer" className="text-brand hover:underline">
                        Ver PDF
                      </a>
                    ) : c.sunatAceptada === false ? (
                      <span className="text-risk" title={c.sunatDescripcion ?? undefined}>
                        Rechazado
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {c.estado === 'EMITIDO' && (
                      <Button
                        variant="ghost"
                        className="px-2 py-1 text-risk"
                        disabled={actionId === c.id}
                        onClick={() => handleAnular(c.id)}
                      >
                        Anular
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {!loading && comprobantes.length === 0 && (
          <EmptyState
            title="Todavía no hay comprobantes"
            description="Emite un comprobante a partir de una reserva con check-out registrado."
            action={<Button onClick={openDialog}>Emitir comprobante</Button>}
          />
        )}
      </div>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title="Emitir comprobante">
        {emitido ? (
          <div className="flex flex-col gap-3 print:gap-1">
            <div className="rounded-lg border border-line p-4 text-sm">
              <p className="text-center font-semibold text-ink">
                {emitido.tipo} {emitido.serie}-{emitido.numero}
              </p>
              <p className="mt-1 text-center text-xs text-ink-3">
                {emitido.fechaEmision.slice(0, 16).replace('T', ' ')}
              </p>
              <div className="mt-3 border-t border-dashed border-line pt-3">
                <p className="text-ink-2">Cliente: {emitido.clienteNombre}</p>
                <p className="text-ink-2">
                  {emitido.clienteTipoDocumento} {emitido.clienteNumeroDocumento}
                </p>
                <p className="text-ink-2">Reserva: {emitido.reservaCodigo}</p>
                <p className="text-ink-2">Habitación: {emitido.habitacionNumero}</p>
              </div>
              <div className="mt-3 border-t border-dashed border-line pt-3">
                <div className="flex justify-between text-ink-2">
                  <span>Subtotal</span>
                  <span>S/ {emitido.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-ink-2">
                  <span>Descuento</span>
                  <span>S/ {emitido.descuento.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-ink">
                  <span>Total</span>
                  <span>S/ {emitido.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => window.print()}>
                Imprimir
              </Button>
              <Button onClick={() => setDialogOpen(false)}>Cerrar</Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {formError && <ErrorBanner message={formError} />}
            <Field label="Reserva (con check-out)" htmlFor="reservaId" required>
              <Select id="reservaId" value={reservaId} onChange={(e) => setReservaId(Number(e.target.value))} required>
                <option value={0} disabled>
                  Selecciona una reserva
                </option>
                {conCheckout.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.codigo} — {r.huespedPrincipal.nombres} {r.huespedPrincipal.apellidos}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Tipo de comprobante" htmlFor="tipo" required>
              <Select id="tipo" value={tipo} onChange={(e) => setTipo(e.target.value as TipoComprobante)}>
                <option value="BOLETA">Boleta</option>
                <option value="FACTURA">Factura</option>
                <option value="RECIBO">Recibo</option>
                <option value="NOTA">Nota</option>
              </Select>
            </Field>
            <div className="mt-2 flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={saving || !reservaId}>
                {saving ? 'Emitiendo…' : 'Emitir'}
              </Button>
            </div>
          </form>
        )}
      </Dialog>
    </div>
  )
}

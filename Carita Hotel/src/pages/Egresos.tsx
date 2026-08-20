import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Badge, type Tone } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Dialog, DialogFooter } from '../components/ui/Dialog'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorBanner } from '../components/ui/ErrorBanner'
import { Field } from '../components/ui/Field'
import { Input } from '../components/ui/Input'
import { PageHeader } from '../components/ui/PageHeader'
import { TableSkeleton } from '../components/ui/Skeleton'
import { IconEgresos, IconPlus } from '../components/ui/icons'
import { RowActions, TBody, TD, TDKey, TDNum, TH, THead, Table, TableCard, TR } from '../components/ui/Table'
import { useAuth } from '../context/AuthContext'
import { getErrorMessage } from '../services/errors'
import { egresosService } from '../services/operacion'
import type { EstadoSolicitudEgreso, SolicitudEgreso } from '../types/operacion'
import { fechaHoraCorta, soles } from '../utils/formato'

const estadoInfo: Record<EstadoSolicitudEgreso, { label: string; tone: Tone }> = {
  PENDIENTE: { label: 'Por aprobar', tone: 'warning' },
  APROBADA: { label: 'Aprobada', tone: 'info' },
  RECHAZADA: { label: 'Rechazada', tone: 'danger' },
  LIQUIDADA: { label: 'Liquidada', tone: 'success' },
}

export function Egresos() {
  const { hasRole } = useAuth()
  const puedeAprobar = hasRole('ADMIN', 'GERENTE')

  const [solicitudes, setSolicitudes] = useState<SolicitudEgreso[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [accionId, setAccionId] = useState<number | null>(null)
  const [verTodas, setVerTodas] = useState(false)

  const [solicitarOpen, setSolicitarOpen] = useState(false)
  const [concepto, setConcepto] = useState('')
  const [montoEstimado, setMontoEstimado] = useState(0)
  const [observaciones, setObservaciones] = useState('')

  const [liquidarDe, setLiquidarDe] = useState<SolicitudEgreso | null>(null)
  const [montoReal, setMontoReal] = useState(0)
  const [comprobante, setComprobante] = useState('')

  const [formError, setFormError] = useState<string | null>(null)
  const [guardando, setGuardando] = useState(false)

  const cargar = async () => {
    setLoading(true)
    setError(null)
    try {
      setSolicitudes(verTodas ? await egresosService.list() : await egresosService.abiertas())
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudieron cargar las solicitudes'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verTodas])

  const porAprobar = useMemo(() => solicitudes.filter((s) => s.estado === 'PENDIENTE').length, [solicitudes])
  const porLiquidar = useMemo(() => solicitudes.filter((s) => s.estado === 'APROBADA').length, [solicitudes])

  const abrirSolicitar = () => {
    setConcepto('')
    setMontoEstimado(0)
    setObservaciones('')
    setFormError(null)
    setSolicitarOpen(true)
  }

  const enviarSolicitud = async (e: FormEvent) => {
    e.preventDefault()
    setGuardando(true)
    setFormError(null)
    try {
      await egresosService.solicitar(concepto, montoEstimado, observaciones || undefined)
      setSolicitarOpen(false)
      await cargar()
    } catch (err) {
      setFormError(getErrorMessage(err, 'No se pudo registrar la solicitud'))
    } finally {
      setGuardando(false)
    }
  }

  const abrirLiquidar = (s: SolicitudEgreso) => {
    setLiquidarDe(s)
    setMontoReal(s.montoEstimado)
    setComprobante('')
    setFormError(null)
  }

  const enviarLiquidacion = async (e: FormEvent) => {
    e.preventDefault()
    if (!liquidarDe) return
    setGuardando(true)
    setFormError(null)
    try {
      await egresosService.liquidar(liquidarDe.id, montoReal, comprobante || undefined)
      setLiquidarDe(null)
      await cargar()
    } catch (err) {
      setFormError(getErrorMessage(err, 'No se pudo liquidar el egreso'))
    } finally {
      setGuardando(false)
    }
  }

  const aprobar = async (id: number) => {
    setAccionId(id)
    try {
      await egresosService.aprobar(id)
      await cargar()
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo aprobar'))
    } finally {
      setAccionId(null)
    }
  }

  const rechazar = async (id: number) => {
    const motivo = prompt('Motivo del rechazo (opcional):')
    if (motivo === null) return
    setAccionId(id)
    try {
      await egresosService.rechazar(id, motivo || undefined)
      await cargar()
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo rechazar'))
    } finally {
      setAccionId(null)
    }
  }

  return (
    <div>
      <PageHeader
        title="Egresos de caja"
        description="Gastos del turno: se pide permiso, se compra y se liquida con el comprobante."
        action={
          <>
            <Button variant="secondary" size="md" onClick={() => setVerTodas((v) => !v)}>
              {verTodas ? 'Ver solo abiertas' : 'Ver historial'}
            </Button>
            <Button onClick={abrirSolicitar}>
              <IconPlus className="size-4" />
              Solicitar egreso
            </Button>
          </>
        }
      />

      {error && <ErrorBanner message={error} />}

      {(porAprobar > 0 || porLiquidar > 0) && (
        <p className="mb-4 text-[13px] text-ink-3">
          {porAprobar > 0 && (
            <>
              <span className="font-semibold text-ink">{porAprobar}</span> esperando aprobación
            </>
          )}
          {porAprobar > 0 && porLiquidar > 0 && ' · '}
          {porLiquidar > 0 && (
            <>
              <span className="font-semibold text-ink">{porLiquidar}</span> aprobadas sin liquidar
            </>
          )}
        </p>
      )}

      <TableCard>
        <Table>
          <THead>
            <TH>Concepto</TH>
            <TH>Solicitante</TH>
            <TH>Fecha</TH>
            <TH className="text-right">Estimado</TH>
            <TH className="text-right">Real</TH>
            <TH>Comprobante</TH>
            <TH>Estado</TH>
            <TH className="text-right">Acciones</TH>
          </THead>
          <TBody>
            {loading ? (
              <TableSkeleton columns={8} />
            ) : (
              solicitudes.map((s) => (
                <TR key={s.id}>
                  <TDKey>{s.concepto}</TDKey>
                  <TD>{s.solicitante ?? '—'}</TD>
                  <TD className="tabular-nums">{fechaHoraCorta(s.fechaSolicitud)}</TD>
                  <TDNum>{soles(s.montoEstimado)}</TDNum>
                  <TDNum className={s.montoReal != null ? 'font-medium text-ink' : ''}>
                    {s.montoReal != null ? soles(s.montoReal) : '—'}
                  </TDNum>
                  <TD>{s.comprobanteReferencia || '—'}</TD>
                  <TD>
                    <Badge tone={estadoInfo[s.estado].tone}>{estadoInfo[s.estado].label}</Badge>
                  </TD>
                  <TD>
                    <RowActions>
                      {s.estado === 'PENDIENTE' && puedeAprobar && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={accionId === s.id}
                            onClick={() => aprobar(s.id)}
                          >
                            Aprobar
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-risk"
                            disabled={accionId === s.id}
                            onClick={() => rechazar(s.id)}
                          >
                            Rechazar
                          </Button>
                        </>
                      )}
                      {s.estado === 'PENDIENTE' && !puedeAprobar && (
                        <span className="text-[12.5px] text-ink-3">Esperando aprobación</span>
                      )}
                      {s.estado === 'APROBADA' && (
                        <Button size="sm" variant="secondary" onClick={() => abrirLiquidar(s)}>
                          Liquidar
                        </Button>
                      )}
                    </RowActions>
                  </TD>
                </TR>
              ))
            )}
          </TBody>
        </Table>

        {!loading && solicitudes.length === 0 && (
          <EmptyState
            icon={<IconEgresos className="size-5" />}
            title={verTodas ? 'Sin egresos registrados' : 'No hay solicitudes abiertas'}
            description="Cuando el personal necesite dinero para insumos, la solicitud aparece aquí para aprobarse y luego liquidarse con su comprobante."
            action={<Button onClick={abrirSolicitar}>Solicitar egreso</Button>}
          />
        )}
      </TableCard>

      <Dialog
        open={solicitarOpen}
        onClose={() => setSolicitarOpen(false)}
        title="Solicitar egreso"
        description="Pide permiso antes de gastar. El dinero sale de caja recién al liquidar."
      >
        <form onSubmit={enviarSolicitud} className="flex flex-col gap-4">
          {formError && <ErrorBanner message={formError} />}
          <Field label="¿Para qué es el gasto?" htmlFor="concepto" required>
            <Input
              id="concepto"
              value={concepto}
              onChange={(e) => setConcepto(e.target.value)}
              placeholder="Ej. Focos y detergente para el 2do piso"
              required
            />
          </Field>
          <Field
            label="Monto estimado (S/)"
            htmlFor="montoEstimado"
            required
            hint="Luego registras el monto real."
          >
            <Input
              id="montoEstimado"
              type="number"
              min={0.01}
              step="0.01"
              value={montoEstimado}
              onChange={(e) => setMontoEstimado(Number(e.target.value))}
              required
            />
          </Field>
          <Field label="Observaciones" htmlFor="observaciones">
            <Input
              id="observaciones"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
            />
          </Field>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setSolicitarOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={guardando || !concepto || montoEstimado <= 0}>
              {guardando ? 'Enviando…' : 'Enviar solicitud'}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>

      <Dialog
        open={liquidarDe !== null}
        onClose={() => setLiquidarDe(null)}
        title="Liquidar egreso"
        description={liquidarDe?.concepto}
      >
        <form onSubmit={enviarLiquidacion} className="flex flex-col gap-4">
          {formError && <ErrorBanner message={formError} />}
          {liquidarDe && (
            <p className="rounded-lg bg-canvas px-3 py-2 text-[13px] text-ink-2">
              Se aprobó por <span className="font-medium text-ink">{soles(liquidarDe.montoEstimado)}</span>.
              Al guardar, el monto real sale de la caja del turno.
            </p>
          )}
          <Field label="Monto real gastado (S/)" htmlFor="montoReal" required>
            <Input
              id="montoReal"
              type="number"
              min={0.01}
              step="0.01"
              value={montoReal}
              onChange={(e) => setMontoReal(Number(e.target.value))}
              required
            />
          </Field>
          <Field label="Comprobante" htmlFor="comprobante" hint="Número de boleta o factura de la compra.">
            <Input
              id="comprobante"
              value={comprobante}
              onChange={(e) => setComprobante(e.target.value)}
              placeholder="Ej. Boleta B001-4521"
            />
          </Field>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setLiquidarDe(null)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={guardando || montoReal <= 0}>
              {guardando ? 'Liquidando…' : 'Liquidar y descontar'}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorBanner } from '../components/ui/ErrorBanner'
import { PageHeader } from '../components/ui/PageHeader'
import { StatCard } from '../components/ui/StatCard'
import { TableSkeleton } from '../components/ui/Skeleton'
import { IconAlert, IconHospedados } from '../components/ui/icons'
import { RowActions, TBody, TD, TDKey, TDNum, TH, THead, Table, TableCard, TR } from '../components/ui/Table'
import { getErrorMessage } from '../services/errors'
import { hospedadosService } from '../services/operacion'
import type { Hospedado } from '../types/operacion'
import { fechaCorta, horaLegible, soles } from '../utils/formato'
import { useNavigate } from 'react-router-dom'

type Filtro = 'todas' | 'vencidas' | 'deuda'

export function Hospedados() {
  const [hospedados, setHospedados] = useState<Hospedado[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filtro, setFiltro] = useState<Filtro>('todas')
  const navigate = useNavigate()

  const cargar = async () => {
    setLoading(true)
    setError(null)
    try {
      setHospedados(await hospedadosService.activas())
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo cargar la lista de hospedados'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargar()
  }, [])

  const vencidas = useMemo(() => hospedados.filter((e) => e.vencida), [hospedados])
  const conDeuda = useMemo(() => hospedados.filter((e) => e.saldoPendiente > 0), [hospedados])
  const totalPorCobrar = useMemo(() => hospedados.reduce((s, e) => s + e.saldoPendiente, 0), [hospedados])

  const visibles = filtro === 'vencidas' ? vencidas : filtro === 'deuda' ? conDeuda : hospedados

  const filtros: { id: Filtro; label: string; total: number }[] = [
    { id: 'todas', label: 'Todas', total: hospedados.length },
    { id: 'vencidas', label: 'Vencidas', total: vencidas.length },
    { id: 'deuda', label: 'Con saldo', total: conDeuda.length },
  ]

  return (
    <div>
      <PageHeader
        title="Huéspedes hospedados"
        description="Huéspedes hospedados ahora mismo, con su cuenta y su hora de salida."
      />

      {error && <ErrorBanner message={error} />}

      <div className="mb-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Habitaciones ocupadas" value={hospedados.length} />
        <StatCard
          label="Pasaron su hora"
          value={vencidas.length}
          hint={vencidas.length > 0 ? 'Se cobra un día adicional' : undefined}
        />
        <StatCard label="Con saldo pendiente" value={conDeuda.length} />
        <StatCard label="Total por cobrar" value={soles(totalPorCobrar)} tone="money" />
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-1">
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
            <span className="ml-1.5 tabular-nums text-ink-3">{f.total}</span>
          </button>
        ))}
      </div>

      <TableCard>
        <Table>
          <THead>
            <TH>Hab.</TH>
            <TH>Huésped</TH>
            <TH>Entrada</TH>
            <TH>Salida</TH>
            <TH className="text-right">Cuenta</TH>
            <TH className="text-right">Pagado</TH>
            <TH className="text-right">Saldo</TH>
            <TH>Estado</TH>
            <TH className="text-right">Acción</TH>
          </THead>
          <TBody>
            {loading ? (
              <TableSkeleton columns={9} />
            ) : (
              visibles.map((e) => (
                <TR key={e.reservaId} className={e.vencida ? 'bg-risk-soft/45' : ''}>
                  <TDKey>{e.habitacionNumero}</TDKey>
                  <TD>
                    <span className="block text-ink">{e.huespedNombre}</span>
                    <span className="block text-[12px] tabular-nums text-ink-3">{e.huespedDocumento}</span>
                  </TD>
                  <TD className="tabular-nums">{fechaCorta(e.fechaEntrada)}</TD>
                  <TD className="tabular-nums">
                    <span className={e.vencida ? 'font-medium text-risk' : ''}>
                      {fechaCorta(e.fechaSalida)}
                    </span>
                    <span className="block text-[12px] text-ink-3">{horaLegible(e.horaLimiteSalida)}</span>
                  </TD>
                  <TDNum>
                    {soles(e.totalCuenta)}
                    {e.cargoExtra > 0 && (
                      <span className="block text-[12px] text-risk">
                        +{soles(e.cargoExtra)} · {e.diasExtra}d extra
                      </span>
                    )}
                  </TDNum>
                  <TDNum>{soles(e.totalPagado)}</TDNum>
                  <TDNum className={e.saldoPendiente > 0 ? 'font-semibold text-ink' : 'text-ink-3'}>
                    {soles(e.saldoPendiente)}
                  </TDNum>
                  <TD>
                    {e.vencida ? (
                      <Badge tone="danger">
                        <IconAlert className="size-3" />
                        Vencida
                      </Badge>
                    ) : e.saldoPendiente > 0 ? (
                      <Badge tone="warning">Por cobrar</Badge>
                    ) : (
                      <Badge tone="success">Al día</Badge>
                    )}
                  </TD>
                  <TD>
                    <RowActions>
                      <Button size="sm" variant="ghost" onClick={() => navigate('/pagos')}>
                        Cobrar
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => navigate('/checkout')}>
                        Check-out
                      </Button>
                    </RowActions>
                  </TD>
                </TR>
              ))
            )}
          </TBody>
        </Table>

        {!loading && visibles.length === 0 && (
          <EmptyState
            icon={<IconHospedados className="size-5" />}
            title={filtro === 'todas' ? 'No hay huéspedes hospedados' : 'Nada en este filtro'}
            description={
              filtro === 'todas'
                ? 'Los huéspedes aparecen aquí cuando registras el check-in de una reserva.'
                : 'Cambia el filtro para ver al resto de los huéspedes hospedados.'
            }
          />
        )}
      </TableCard>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { ErrorBanner } from '../components/ui/ErrorBanner'
import { Panel, PanelHeader, SectionLabel } from '../components/ui/Panel'
import { StatCard } from '../components/ui/StatCard'
import { IconAlert, IconCaja, IconChevron } from '../components/ui/icons'
import { useAuth } from '../context/AuthContext'
import { cajasService } from '../services/cajas'
import { dashboardService } from '../services/dashboard'
import { getErrorMessage } from '../services/errors'
import type { Caja, DashboardResumen } from '../types'
import { fechaLarga, horaLegible, saludo, soles } from '../utils/formato'

/** Reparto del hotel en una sola barra: el estado completo de un vistazo. */
function BarraOcupacion({ r }: { r: DashboardResumen }) {
  const segmentos = [
    { label: 'Ocupadas', valor: r.habitacionesOcupadas, clase: 'bg-brand' },
    { label: 'Reservadas', valor: r.habitacionesReservadas, clase: 'bg-info' },
    { label: 'Limpieza', valor: r.habitacionesLimpieza, clase: 'bg-warn' },
    { label: 'Mantenimiento', valor: r.habitacionesMantenimiento, clase: 'bg-risk' },
    { label: 'Disponibles', valor: r.habitacionesDisponibles, clase: 'bg-line-strong' },
  ].filter((s) => s.valor > 0)

  const total = segmentos.reduce((s, x) => s + x.valor, 0)

  return (
    <div className="px-4 py-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[34px] font-semibold leading-none tracking-[-0.03em] text-ink tabular-nums">
            {r.tasaOcupacion}%
          </p>
          <p className="mt-1.5 text-[12.5px] text-ink-3">Ocupación actual</p>
        </div>
        <p className="text-[12.5px] tabular-nums text-ink-3">
          <span className="font-semibold text-ink">{r.habitacionesOcupadas}</span> de {total} habitaciones
        </p>
      </div>

      {total > 0 && (
        <div className="mt-4 flex h-2.5 gap-0.5 overflow-hidden rounded-full">
          {segmentos.map((s) => (
            <div
              key={s.label}
              className={s.clase}
              style={{ width: `${(s.valor / total) * 100}%` }}
              title={`${s.label}: ${s.valor}`}
            />
          ))}
        </div>
      )}

      <ul className="mt-3.5 grid grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-3">
        {segmentos.map((s) => (
          <li key={s.label} className="flex items-center gap-2 text-[12.5px]">
            <span className={`size-2 shrink-0 rounded-sm ${s.clase}`} />
            <span className="text-ink-2">{s.label}</span>
            <span className="ml-auto font-medium tabular-nums text-ink">{s.valor}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function PanelCaja({ caja }: { caja: Caja | null }) {
  if (!caja) {
    return (
      <Panel className="flex flex-col">
        <PanelHeader title="Caja del turno" />
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-8 text-center">
          <IconCaja className="size-7 text-ink-3" />
          <p className="text-[13px] text-ink-3">No hay una caja abierta.</p>
          <Link to="/caja">
            <Button size="sm" variant="secondary">
              Abrir caja
            </Button>
          </Link>
        </div>
      </Panel>
    )
  }

  return (
    <Panel className="flex flex-col">
      <PanelHeader
        title="Caja del turno"
        meta={caja.miTurno ? 'Tu turno' : `Abrió ${caja.usuarioApertura}`}
        action={
          <Link
            to="/caja"
            className="flex items-center gap-0.5 text-[12.5px] font-medium text-brand hover:underline"
          >
            Ver <IconChevron className="size-3.5" />
          </Link>
        }
      />
      <div className="flex flex-1 flex-col justify-between px-4 py-4">
        <div>
          <p className="text-[26px] font-semibold leading-none tracking-[-0.025em] tabular-nums text-ink">
            {soles(caja.efectivoEsperado)}
          </p>
          <p className="mt-1.5 text-[12.5px] text-ink-3">
            Efectivo esperado · desde {horaLegible(caja.fechaApertura.slice(11, 19))}
          </p>
        </div>
        <dl className="mt-4 space-y-1.5 border-t border-line pt-3 text-[12.5px]">
          <div className="flex justify-between">
            <dt className="text-ink-3">Monto inicial</dt>
            <dd className="tabular-nums text-ink-2">{soles(caja.montoInicial)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-3">Ingresos</dt>
            <dd className="tabular-nums text-ok">+ {soles(caja.totalIngresos)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-3">Egresos</dt>
            <dd className="tabular-nums text-risk">− {soles(caja.totalEgresos)}</dd>
          </div>
        </dl>
      </div>
    </Panel>
  )
}

export function Dashboard() {
  const { user } = useAuth()
  const [resumen, setResumen] = useState<DashboardResumen | null>(null)
  const [caja, setCaja] = useState<Caja | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    dashboardService
      .resumen()
      .then(setResumen)
      .catch((err) => setError(getErrorMessage(err, 'No se pudo cargar el panel')))

    // Puede no haber caja abierta: es un estado válido, no un error.
    cajasService
      .abierta()
      .then(setCaja)
      .catch(() => setCaja(null))
  }, [])

  return (
    <div>
      <header className="mb-6">
        <p className="text-[13px] text-ink-3">{fechaLarga()}</p>
        <h1 className="mt-1 text-[22px] font-semibold tracking-[-0.02em] text-ink">
          {saludo()}, {user?.nombres ?? ''}
        </h1>
      </header>

      {error && <ErrorBanner message={error} />}

      {resumen && (
        <div className="flex flex-col gap-6">
          {resumen.estanciasVencidas > 0 && (
            <Link
              to="/estancias"
              className="group flex items-center gap-3.5 rounded-[var(--radius-card)] border border-risk/30
 bg-risk-soft px-4 py-3.5 transition-colors duration-150 hover:border-risk/50"
            >
              <IconAlert className="size-5 shrink-0 text-risk" />
              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] font-semibold text-risk">
                  {resumen.estanciasVencidas}{' '}
                  {resumen.estanciasVencidas === 1 ? 'huésped pasó' : 'huéspedes pasaron'} su hora de salida
                </p>
                <p className="mt-0.5 text-[12.5px] text-risk/85">
                  {soles(resumen.porCobrarVencidas)} por cobrar · se aplica un día adicional
                </p>
              </div>
              <IconChevron className="size-4 shrink-0 text-risk transition-transform duration-150 group-hover:translate-x-0.5" />
            </Link>
          )}

          <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
            <Panel>
              <PanelHeader title="Estado del hotel" />
              <BarraOcupacion r={resumen} />
            </Panel>
            <PanelCaja caja={caja} />
          </div>

          <div>
            <SectionLabel>Movimiento de hoy</SectionLabel>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <StatCard label="Ingresos del día" value={soles(resumen.ingresosHoy)} tone="money" />
              <StatCard label="Reservas" value={resumen.reservasHoy} />
              <StatCard label="Check-in" value={resumen.checkinsHoy} />
              <StatCard label="Check-out" value={resumen.checkoutsHoy} />
            </div>
          </div>

          {(resumen.egresosPendientes > 0 || resumen.avisosNoLeidos > 0) && (
            <div>
              <SectionLabel>Pendientes</SectionLabel>
              <div className="grid gap-4 sm:grid-cols-2">
                {resumen.egresosPendientes > 0 && (
                  <Link
                    to="/egresos"
                    className="flex items-center justify-between gap-3 rounded-[var(--radius-card)] border
 border-line bg-surface px-4 py-3.5 transition-colors duration-150 hover:border-line-strong"
                  >
                    <span className="text-[13px] text-ink-2">
                      <span className="font-semibold text-ink">{resumen.egresosPendientes}</span> solicitud
                      {resumen.egresosPendientes === 1 ? '' : 'es'} de egreso por aprobar
                    </span>
                    <IconChevron className="size-4 shrink-0 text-ink-3" />
                  </Link>
                )}
                {resumen.avisosNoLeidos > 0 && (
                  <Link
                    to="/avisos"
                    className="flex items-center justify-between gap-3 rounded-[var(--radius-card)] border
 border-line bg-surface px-4 py-3.5 transition-colors duration-150 hover:border-line-strong"
                  >
                    <span className="text-[13px] text-ink-2">
                      <span className="font-semibold text-ink">{resumen.avisosNoLeidos}</span> aviso
                      {resumen.avisosNoLeidos === 1 ? '' : 's'} del personal sin leer
                    </span>
                    <IconChevron className="size-4 shrink-0 text-ink-3" />
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

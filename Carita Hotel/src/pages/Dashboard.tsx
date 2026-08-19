import { useEffect, useState } from 'react'
import { ErrorBanner } from '../components/ui/ErrorBanner'
import { PageHeader } from '../components/ui/PageHeader'
import { StatCard } from '../components/ui/StatCard'
import { getErrorMessage } from '../services/errors'
import { dashboardService } from '../services/dashboard'
import type { DashboardResumen } from '../types'

export function Dashboard() {
  const [resumen, setResumen] = useState<DashboardResumen | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    dashboardService
      .resumen()
      .then(setResumen)
      .catch((err) => setError(getErrorMessage(err, 'No se pudo cargar el resumen')))
  }, [])

  return (
    <div>
      <PageHeader title="Dashboard" description="Resumen de habitaciones, reservas y movimientos del día." />

      {error && <ErrorBanner message={error} />}

      {resumen && (
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="mb-3 text-sm font-medium text-neutral-500 dark:text-neutral-400">Habitaciones</h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              <StatCard label="Disponibles" value={resumen.habitacionesDisponibles} />
              <StatCard label="Reservadas" value={resumen.habitacionesReservadas} />
              <StatCard label="Ocupadas" value={resumen.habitacionesOcupadas} />
              <StatCard label="En limpieza" value={resumen.habitacionesLimpieza} />
              <StatCard label="Mantenimiento" value={resumen.habitacionesMantenimiento} />
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium text-neutral-500 dark:text-neutral-400">Hoy</h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatCard label="Reservas del día" value={resumen.reservasHoy} />
              <StatCard label="Check-in del día" value={resumen.checkinsHoy} />
              <StatCard label="Check-out del día" value={resumen.checkoutsHoy} />
              <StatCard label="Ingresos del día" value={`S/ ${resumen.ingresosHoy.toFixed(2)}`} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

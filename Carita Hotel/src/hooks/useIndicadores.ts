import { useEffect, useState } from 'react'
import { dashboardService } from '../services/dashboard'

export interface Indicadores {
  vencidas: number
  avisos: number
  egresos: number
}

const VACIO: Indicadores = { vencidas: 0, avisos: 0, egresos: 0 }

/**
 * Contadores que la barra lateral muestra en vivo. Se refrescan solos para que
 * recepción vea un huésped vencido sin tener que entrar a la sección.
 */
export function useIndicadores(intervaloMs = 60_000): Indicadores {
  const [datos, setDatos] = useState<Indicadores>(VACIO)

  useEffect(() => {
    let activo = true

    const cargar = async () => {
      try {
        const r = await dashboardService.resumen()
        if (!activo) return
        setDatos({
          vencidas: r.estanciasVencidas,
          avisos: r.avisosNoLeidos,
          egresos: r.egresosPendientes,
        })
      } catch {
        // Sin conexión momentánea: se conservan los últimos valores conocidos.
      }
    }

    cargar()
    const id = setInterval(cargar, intervaloMs)
    return () => {
      activo = false
      clearInterval(id)
    }
  }, [intervaloMs])

  return datos
}

import { api } from './api'
import type { ReporteResumen } from '../types'

export const reportesService = {
  resumen: (desde: string, hasta: string) =>
    api.get<ReporteResumen>('/reportes/resumen', { params: { desde, hasta } }).then((r) => r.data),

  descargarReservasCsv: (desde: string, hasta: string) =>
    descargar('/reportes/reservas.csv', { desde, hasta }, `reservas_${desde}_${hasta}.csv`),

  descargarReservasExcel: (desde: string, hasta: string) =>
    descargar('/reportes/reservas.xlsx', { desde, hasta }, `reservas_${desde}_${hasta}.xlsx`),

  descargarResumenPdf: (desde: string, hasta: string) =>
    descargar('/reportes/resumen.pdf', { desde, hasta }, `resumen_${desde}_${hasta}.pdf`),
}

async function descargar(url: string, params: Record<string, string>, filename: string) {
  const response = await api.get(url, { params, responseType: 'blob' })
  const objectUrl = URL.createObjectURL(response.data as Blob)
  const link = document.createElement('a')
  link.href = objectUrl
  link.download = filename
  link.click()
  URL.revokeObjectURL(objectUrl)
}

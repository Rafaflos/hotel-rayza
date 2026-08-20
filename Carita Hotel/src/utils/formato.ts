/** Formatos compartidos: los montos y fechas se ven igual en todo el sistema. */

export function soles(monto: number | undefined | null): string {
  const valor = monto ?? 0
  return `S/ ${valor.toFixed(2)}`
}

/** "2026-08-20T14:30:00" → "20/08 14:30" */
export function fechaHoraCorta(iso: string): string {
  const [fecha, hora] = iso.split('T')
  const [, mes, dia] = fecha.split('-')
  return `${dia}/${mes} ${hora?.slice(0, 5) ?? ''}`.trim()
}

/** "2026-08-20" → "20/08/2026" */
export function fechaCorta(iso: string): string {
  const [anio, mes, dia] = iso.split('T')[0].split('-')
  return `${dia}/${mes}/${anio}`
}

/** "13:00:00" → "1:00 p.m." */
export function horaLegible(hora: string): string {
  const [h, m] = hora.split(':').map(Number)
  const sufijo = h >= 12 ? 'p.m.' : 'a.m.'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${String(m).padStart(2, '0')} ${sufijo}`
}

export function saludo(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Buenos días'
  if (h < 19) return 'Buenas tardes'
  return 'Buenas noches'
}

export function fechaLarga(): string {
  return new Date().toLocaleDateString('es-PE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

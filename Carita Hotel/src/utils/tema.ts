/**
 * Tema claro/oscuro. Recepción trabaja turnos de día y de noche, así que la
 * preferencia es manual y persistente, con el sistema como valor inicial.
 */
export type Tema = 'claro' | 'oscuro'

const CLAVE = 'tema'

export function temaGuardado(): Tema {
  const guardado = localStorage.getItem(CLAVE)
  if (guardado === 'claro' || guardado === 'oscuro') return guardado
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro'
}

export function aplicarTema(tema: Tema) {
  document.documentElement.classList.toggle('dark', tema === 'oscuro')
  localStorage.setItem(CLAVE, tema)
}

/** Se llama antes de montar React para que no haya destello del tema contrario. */
export function iniciarTema() {
  aplicarTema(temaGuardado())
}

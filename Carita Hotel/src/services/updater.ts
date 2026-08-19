// Revisa si hay una nueva versión (solo dentro de la app de escritorio Tauri).
// En el navegador de desarrollo no hace nada.
export async function checkForUpdates() {
  // Solo corre dentro de Tauri (la app empaquetada), no en el navegador.
  if (!('__TAURI_INTERNALS__' in window)) return

  try {
    const { check } = await import('@tauri-apps/plugin-updater')
    const { relaunch } = await import('@tauri-apps/plugin-process')

    const update = await check()
    if (!update) return

    const confirmar = window.confirm(
      `Hay una nueva versión de Hotel Rayza disponible (${update.version}).\n\n` +
        `${update.body ?? ''}\n\n¿Descargar e instalar ahora? La app se reiniciará al terminar.`,
    )
    if (!confirmar) return

    await update.downloadAndInstall()
    await relaunch()
  } catch (err) {
    // Si falla (sin internet, endpoint no configurado, etc.), no molestamos al usuario.
    console.warn('No se pudo revisar actualizaciones:', err)
  }
}

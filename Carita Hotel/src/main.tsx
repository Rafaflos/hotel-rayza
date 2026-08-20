import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { checkForUpdates } from './services/updater'
import { iniciarTema } from './utils/tema'

// Antes de montar, para que no haya un destello del tema contrario.
iniciarTema()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Al abrir la app, revisa si hay una versión nueva (solo dentro de Tauri).
checkForUpdates()

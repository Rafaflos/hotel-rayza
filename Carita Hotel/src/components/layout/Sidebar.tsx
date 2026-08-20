import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useIndicadores } from '../../hooks/useIndicadores'
import { grupos, puedeVer, type Indicador } from '../../utils/modulos'
import { aplicarTema, temaGuardado, type Tema } from '../../utils/tema'
import { CambiarPasswordDialog } from '../CambiarPasswordDialog'
import { IconKey, IconLogout, IconMoon, IconSun } from '../ui/icons'

export function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const indicadores = useIndicadores()
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [tema, setTema] = useState<Tema>(temaGuardado)

  const roles = user?.roles ?? []
  const gruposVisibles = grupos
    .map((g) => ({ ...g, modulos: g.modulos.filter((m) => puedeVer(m, roles)) }))
    .filter((g) => g.modulos.length > 0)

  const contar = (indicador?: Indicador) => (indicador ? indicadores[indicador] : 0)

  const cambiarTema = () => {
    const siguiente: Tema = tema === 'oscuro' ? 'claro' : 'oscuro'
    aplicarTema(siguiente)
    setTema(siguiente)
  }

  const iniciales = user ? `${user.nombres[0] ?? ''}${user.apellidos[0] ?? ''}`.toUpperCase() : ''

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-line bg-panel">
      <div className="flex items-center gap-2.5 px-4 py-4">
        <img src="/logo.png" alt="" className="size-8 shrink-0 rounded-md object-contain" />
        <div className="min-w-0">
          <p className="truncate text-[13.5px] font-semibold tracking-[-0.01em] text-ink">Hotel Rayza</p>
          <p className="truncate text-[11px] text-ink-3">Gestión y recepción</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2.5 pb-3">
        {gruposVisibles.map((grupo) => (
          <div key={grupo.titulo} className="mb-4 last:mb-0">
            <p className="px-2.5 pb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.07em] text-ink-3">
              {grupo.titulo}
            </p>
            <div className="flex flex-col gap-px">
              {grupo.modulos.map(({ to, label, icon: Icono, indicador }) => {
                const total = contar(indicador)
                return (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === '/'}
                    className={({ isActive }) =>
                      `group flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[13.5px]
                       transition-colors duration-150 ${
                         isActive
                           ? 'bg-brand-soft font-medium text-brand-ink'
                           : 'text-ink-2 hover:bg-canvas hover:text-ink'
                       }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icono className={`size-[18px] shrink-0 ${isActive ? 'text-brand' : 'text-ink-3'}`} />
                        <span className="flex-1 truncate">{label}</span>
                        {total > 0 && (
                          <span
                            className={`min-w-[18px] rounded-full px-1.5 text-center text-[11px] font-semibold tabular-nums ${
                              indicador === 'vencidas'
                                ? 'bg-risk text-white'
                                : 'bg-line-strong text-ink'
                            }`}
                          >
                            {total}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-line p-2.5">
        {user && (
          <div className="mb-1.5 flex items-center gap-2.5 px-1.5 py-1.5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-[11.5px] font-semibold text-brand-ink">
              {iniciales}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-ink">
                {user.nombres} {user.apellidos}
              </p>
              <p className="truncate text-[11px] text-ink-3">{user.roles.join(' · ')}</p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-px">
          <button
            type="button"
            onClick={cambiarTema}
            className="flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[13px] text-ink-2
              transition-colors duration-150 hover:bg-canvas hover:text-ink"
          >
            {tema === 'oscuro' ? (
              <IconSun className="size-[17px] text-ink-3" />
            ) : (
              <IconMoon className="size-[17px] text-ink-3" />
            )}
            {tema === 'oscuro' ? 'Modo claro' : 'Modo oscuro'}
          </button>
          <button
            type="button"
            onClick={() => setPasswordOpen(true)}
            className="flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[13px] text-ink-2
              transition-colors duration-150 hover:bg-canvas hover:text-ink"
          >
            <IconKey className="size-[17px] text-ink-3" />
            Cambiar contraseña
          </button>
          <button
            type="button"
            onClick={() => {
              logout()
              navigate('/login')
            }}
            className="flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[13px] text-ink-2
              transition-colors duration-150 hover:bg-canvas hover:text-ink"
          >
            <IconLogout className="size-[17px] text-ink-3" />
            Cerrar sesión
          </button>
        </div>
      </div>

      <CambiarPasswordDialog open={passwordOpen} onClose={() => setPasswordOpen(false)} />
    </aside>
  )
}

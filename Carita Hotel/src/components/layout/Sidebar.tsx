import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { modulos, puedeVer } from '../../utils/modulos'
import { CambiarPasswordDialog } from '../CambiarPasswordDialog'

export function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [passwordOpen, setPasswordOpen] = useState(false)
  const roles = user?.roles ?? []
  const visibles = modulos.filter((m) => puedeVer(m, roles))

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="p-4">
        <h1 className="mb-6 text-lg font-semibold">Hotel Rayza</h1>
        <nav className="flex flex-col gap-1">
          {visibles.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `rounded px-3 py-2 text-sm ${
                  isActive
                    ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                    : 'text-neutral-700 hover:bg-neutral-200 dark:text-neutral-300 dark:hover:bg-neutral-800'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto border-t border-neutral-200 p-4 dark:border-neutral-800">
        {user && (
          <div className="mb-3">
            <p className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
              {user.nombres} {user.apellidos}
            </p>
            <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">{user.roles.join(', ')}</p>
          </div>
        )}
        <button
          type="button"
          onClick={() => setPasswordOpen(true)}
          className="w-full rounded px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-200 dark:text-neutral-300 dark:hover:bg-neutral-800"
        >
          Cambiar contraseña
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full rounded px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-200 dark:text-neutral-300 dark:hover:bg-neutral-800"
        >
          Cerrar sesión
        </button>
      </div>

      <CambiarPasswordDialog open={passwordOpen} onClose={() => setPasswordOpen(false)} />
    </aside>
  )
}

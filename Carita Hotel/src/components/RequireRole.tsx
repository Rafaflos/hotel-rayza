import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Protege una ruta: si el usuario no tiene ninguno de los roles, lo manda al dashboard.
export function RequireRole({ roles, children }: { roles: string[]; children: ReactNode }) {
  const { hasRole } = useAuth()
  if (!hasRole(...roles)) return <Navigate to="/" replace />
  return children
}

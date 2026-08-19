import { createContext, useContext, useState, type ReactNode } from 'react'

export interface AuthUser {
  id: number
  username: string
  nombres: string
  apellidos: string
  roles: string[]
}

interface AuthContextValue {
  token: string | null
  user: AuthUser | null
  login: (token: string, user: AuthUser) => void
  logout: () => void
  hasRole: (...roles: string[]) => boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function readStoredUser(): AuthUser | null {
  const raw = localStorage.getItem('user')
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [user, setUser] = useState<AuthUser | null>(readStoredUser())

  const login = (newToken: string, newUser: AuthUser) => {
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  const hasRole = (...roles: string[]) => {
    if (!user) return false
    return roles.some((r) => user.roles.includes(r))
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/Button'
import { Field } from '../components/ui/Field'
import { Input } from '../components/ui/Input'
import { ErrorBanner } from '../components/ui/ErrorBanner'

export function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [entrando, setEntrando] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setEntrando(true)
    try {
      const { data } = await api.post('/auth/login', { username, password })
      login(data.token, {
        id: data.userId,
        username: data.username,
        nombres: data.nombres,
        apellidos: data.apellidos,
        roles: data.roles,
      })
      navigate('/')
    } catch {
      setError('Usuario o contraseña incorrectos')
    } finally {
      setEntrando(false)
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-canvas px-4">
      <div className="w-full max-w-[380px]">
        <div className="mb-7 flex flex-col items-center text-center">
          <img src="/logo.png" alt="Hotel Rayza" className="mb-4 size-20 object-contain" />
          <h1 className="text-[19px] font-semibold tracking-[-0.02em] text-ink">Hotel Rayza</h1>
          <p className="mt-1 text-[13px] text-ink-3">Sistema de gestión y recepción</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-[var(--shadow-card)]"
        >
          {error && <ErrorBanner message={error} />}

          <div className="flex flex-col gap-4">
            <Field label="Usuario" htmlFor="username">
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                autoFocus
                required
              />
            </Field>
            <Field label="Contraseña" htmlFor="password">
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </Field>
            <Button type="submit" className="mt-1 w-full" disabled={entrando}>
              {entrando ? 'Entrando…' : 'Ingresar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

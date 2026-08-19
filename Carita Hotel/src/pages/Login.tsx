import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'

export function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
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
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="w-80 space-y-4 rounded-lg border border-neutral-200 p-6 dark:border-neutral-800">
        <h1 className="text-xl font-semibold">Hotel Rayza</h1>
        <input
          className="w-full rounded border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="w-full rounded border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          className="w-full rounded bg-neutral-900 px-3 py-2 text-white dark:bg-neutral-100 dark:text-neutral-900"
        >
          Ingresar
        </button>
      </form>
    </div>
  )
}

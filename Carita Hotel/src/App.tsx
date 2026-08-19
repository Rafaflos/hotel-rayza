import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { RequireAuth } from './components/RequireAuth'
import { RequireRole } from './components/RequireRole'
import { Layout } from './components/layout/Layout'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { Habitaciones } from './pages/Habitaciones'
import { Huespedes } from './pages/Huespedes'
import { Reservas } from './pages/Reservas'
import { CheckIn } from './pages/CheckIn'
import { CheckOut } from './pages/CheckOut'
import { Pagos } from './pages/Pagos'
import { Caja } from './pages/Caja'
import { Consumos } from './pages/Consumos'
import { Limpieza } from './pages/Limpieza'
import { Mantenimiento } from './pages/Mantenimiento'
import { Reportes } from './pages/Reportes'
import { Comprobantes } from './pages/Comprobantes'
import { Usuarios } from './pages/Usuarios'
import { Empleados } from './pages/Empleados'
import type { JSX } from 'react'

const TODOS_OPERATIVOS = ['ADMIN', 'GERENTE', 'RECEPCIONISTA']

// Cada ruta protegida con los roles que la pueden ver (coincide con utils/modulos.ts).
const rutas: { path: string; element: JSX.Element; roles?: string[] }[] = [
  { path: '/', element: <Dashboard /> },
  { path: '/habitaciones', element: <Habitaciones />, roles: TODOS_OPERATIVOS },
  { path: '/huespedes', element: <Huespedes />, roles: TODOS_OPERATIVOS },
  { path: '/reservas', element: <Reservas />, roles: TODOS_OPERATIVOS },
  { path: '/checkin', element: <CheckIn />, roles: TODOS_OPERATIVOS },
  { path: '/checkout', element: <CheckOut />, roles: TODOS_OPERATIVOS },
  { path: '/consumos', element: <Consumos />, roles: TODOS_OPERATIVOS },
  { path: '/pagos', element: <Pagos />, roles: ['ADMIN', 'GERENTE', 'CAJERO'] },
  { path: '/caja', element: <Caja />, roles: ['ADMIN', 'GERENTE', 'CAJERO'] },
  { path: '/comprobantes', element: <Comprobantes />, roles: ['ADMIN', 'GERENTE', 'CAJERO'] },
  { path: '/limpieza', element: <Limpieza />, roles: ['ADMIN', 'GERENTE', 'LIMPIEZA'] },
  { path: '/mantenimiento', element: <Mantenimiento />, roles: ['ADMIN', 'GERENTE', 'MANTENIMIENTO'] },
  { path: '/reportes', element: <Reportes />, roles: ['ADMIN', 'GERENTE'] },
  { path: '/empleados', element: <Empleados />, roles: ['ADMIN', 'GERENTE'] },
  { path: '/usuarios', element: <Usuarios />, roles: ['ADMIN'] },
]

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            element={
              <RequireAuth>
                <Layout />
              </RequireAuth>
            }
          >
            {rutas.map((ruta) => (
              <Route
                key={ruta.path}
                path={ruta.path}
                element={ruta.roles ? <RequireRole roles={ruta.roles}>{ruta.element}</RequireRole> : ruta.element}
              />
            ))}
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

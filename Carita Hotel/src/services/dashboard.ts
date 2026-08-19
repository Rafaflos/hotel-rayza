import { api } from './api'
import type { DashboardResumen } from '../types'

export const dashboardService = {
  resumen: () => api.get<DashboardResumen>('/dashboard/resumen').then((r) => r.data),
}

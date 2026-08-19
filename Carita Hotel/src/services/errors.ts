import { isAxiosError } from 'axios'
import type { ApiError } from '../types'

export function getErrorMessage(error: unknown, fallback = 'Ocurrió un error inesperado'): string {
  if (isAxiosError<ApiError>(error)) {
    return error.response?.data?.message ?? fallback
  }
  return fallback
}

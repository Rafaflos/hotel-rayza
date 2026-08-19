import { api } from './api'
import type { Checkout, CheckoutInput } from '../types'

export const checkoutsService = {
  create: (input: CheckoutInput) => api.post<Checkout>('/checkouts', input).then((r) => r.data),
}

import { api } from './api'
import type { Aviso, AvisoInput, Estancia, SolicitudEgreso } from '../types/operacion'

export const estanciasService = {
  activas: () => api.get<Estancia[]>('/estancias').then((r) => r.data),
  vencidas: () => api.get<Estancia[]>('/estancias', { params: { soloVencidas: true } }).then((r) => r.data),
}

export const egresosService = {
  list: () => api.get<SolicitudEgreso[]>('/egresos').then((r) => r.data),
  abiertas: () => api.get<SolicitudEgreso[]>('/egresos', { params: { soloAbiertas: true } }).then((r) => r.data),
  mias: () => api.get<SolicitudEgreso[]>('/egresos', { params: { mias: true } }).then((r) => r.data),
  solicitar: (concepto: string, montoEstimado: number, observaciones?: string) =>
    api.post<SolicitudEgreso>('/egresos', { concepto, montoEstimado, observaciones }).then((r) => r.data),
  aprobar: (id: number) => api.post<SolicitudEgreso>(`/egresos/${id}/aprobar`).then((r) => r.data),
  rechazar: (id: number, motivo?: string) =>
    api.post<SolicitudEgreso>(`/egresos/${id}/rechazar`, { observaciones: motivo }).then((r) => r.data),
  liquidar: (id: number, montoReal: number, comprobanteReferencia?: string, observaciones?: string) =>
    api
      .post<SolicitudEgreso>(`/egresos/${id}/liquidar`, { montoReal, comprobanteReferencia, observaciones })
      .then((r) => r.data),
}

export const avisosService = {
  list: (categoria?: string, soloPendientes?: boolean) =>
    api
      .get<Aviso[]>('/avisos', { params: { categoria: categoria || undefined, soloPendientes: soloPendientes || undefined } })
      .then((r) => r.data),
  noLeidos: () => api.get<{ noLeidos: number }>('/avisos/no-leidos').then((r) => r.data.noLeidos),
  create: (input: AvisoInput) => api.post<Aviso>('/avisos', input).then((r) => r.data),
  marcarLeido: (id: number) => api.post(`/avisos/${id}/leido`),
  resolver: (id: number) => api.post<Aviso>(`/avisos/${id}/resolver`).then((r) => r.data),
}

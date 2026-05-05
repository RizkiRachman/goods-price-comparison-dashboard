import { apiClient } from './client'
import type { AlertSubscriptionRequest, AlertSubscriptionResponse } from '@/types/api'

export const alertsApi = {
  subscribe: (body: AlertSubscriptionRequest) =>
    apiClient.post<AlertSubscriptionResponse>('/v1/alerts/subscribe', body).then((r) => r.data),
}

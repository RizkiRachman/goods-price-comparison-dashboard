import { apiClient } from './client'
import type { ApiVersionResponse, HealthResponse, MetricsResponse } from '@/types/api'

export const systemApi = {
  getVersion: () =>
    apiClient.get<ApiVersionResponse>('/v1/version').then((r) => r.data),

  getHealth: () =>
    apiClient.get<HealthResponse>('/v1/health').then((r) => r.data),

  getMetrics: () =>
    apiClient.get<MetricsResponse>('/v1/metrics').then((r) => r.data),
}

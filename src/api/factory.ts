import { apiClient } from './client'
import { cleanParams } from '@/lib/utils'

/**
 * Generic CRUD API factory
 * Creates standard CRUD operations for any resource type
 */
export interface CrudApiConfig {
  basePath: string
}

export function createCrudApi<T, TListResponse, TCreate, TUpdate>(
  config: CrudApiConfig
) {
  const { basePath } = config

  return {
    list: (params?: Record<string, unknown>) => {
      const cleaned = cleanParams(params)
      // Don't send empty params object
      const config = cleaned && Object.keys(cleaned).length > 0 ? { params: cleaned } : {}
      return apiClient
        .get<TListResponse>(basePath, config)
        .then((r) => r.data)
    },

    get: (id: number | string) =>
      apiClient.get<T>(`${basePath}/${id}`).then((r) => r.data),

    create: (body: TCreate) =>
      apiClient.post<T>(basePath, body).then((r) => r.data),

    update: (id: number | string, body: TUpdate) =>
      apiClient.put<T>(`${basePath}/${id}`, body).then((r) => r.data),

    delete: (id: number | string) =>
      apiClient.delete(`${basePath}/${id}`).then((r) => r.data),
  }
}

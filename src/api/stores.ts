import type {
  Store,
  StoreListResponse,
  CreateStoreRequest,
  UpdateStoreRequest,
} from '@/types/api'
import { apiClient } from './client'
import { createCrudApi } from './factory'

// Use factory for standard CRUD operations
const baseApi = createCrudApi<Store, StoreListResponse, CreateStoreRequest, UpdateStoreRequest>({
  basePath: '/v1/stores',
})

export const storesApi = {
  ...baseApi,

  // Custom methods specific to stores
  list: (params?: {
    page?: number
    pageSize?: number
    search?: string
    location?: string
    chain?: string
    status?: string
    sortBy?: 'name' | 'location' | 'chain' | 'createdAt'
    sortOrder?: 'asc' | 'desc'
  }) => baseApi.list(params),

  getChains: () =>
    apiClient.get<{ data: string[] }>('/v1/stores/chains').then((r) => r.data.data),
}

import { apiClient } from './client'
import type { ShoppingOptimizeRequest, ShoppingOptimizeResponse } from '@/types/api'

export const shoppingApi = {
  optimize: (body: ShoppingOptimizeRequest) =>
    apiClient.post<ShoppingOptimizeResponse>('/v1/shopping/optimize', body).then((r) => r.data),
}

import { apiClient } from './client'

export const adminApi = {
  calculateProductPrices: () =>
    apiClient.post<void>('/v1/admin/jobs/product-prices-calculate').then((r) => r.data),
}

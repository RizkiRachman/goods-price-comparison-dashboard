import type {
  Product,
  ProductListResponse,
  CreateProductRequest,
  UpdateProductRequest,
  ProductTrendResponse,
  Granularity,
} from '@/types/api'
import { apiClient } from './client'
import { createCrudApi } from './factory'

// Use factory for standard CRUD operations
const baseApi = createCrudApi<Product, ProductListResponse, CreateProductRequest, UpdateProductRequest>({
  basePath: '/v1/products',
})

export const productsApi = {
  ...baseApi,

  // Custom methods specific to products
  list: (params?: {
    page?: number
    pageSize?: number
    search?: string
    category?: string
    brand?: string
    status?: string
    storeId?: number
    sortBy?: 'name' | 'category' | 'brand' | 'createdAt'
    sortOrder?: 'asc' | 'desc'
    includePrice?: boolean
  }) => baseApi.list(params),

  getTrend: (
    productId: number,
    params?: {
      from?: string
      to?: string
      granularity?: Granularity
    }
  ) =>
    apiClient
      .get<ProductTrendResponse>(`/v1/products/trend/${productId}`, { params })
      .then((r) => r.data),
}

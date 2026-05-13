import type {
  Category,
  CategoryListResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '@/types/api'
import { createCrudApi } from './factory'

const baseApi = createCrudApi<Category, CategoryListResponse, CreateCategoryRequest, UpdateCategoryRequest>({
  basePath: '/v1/categories',
})

export const categoriesApi = {
  ...baseApi,

  list: (params?: {
    page?: number
    pageSize?: number
    search?: string
    status?: string
    sortBy?: 'id' | 'name' | 'createdAt'
    sortOrder?: 'asc' | 'desc'
  }) => baseApi.list(params),
}

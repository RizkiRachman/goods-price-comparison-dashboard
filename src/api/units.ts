import type {
  Unit,
  UnitListResponse,
  CreateUnitRequest,
  UpdateUnitRequest,
} from '@/types/api'
import { createCrudApi } from './factory'

const baseApi = createCrudApi<Unit, UnitListResponse, CreateUnitRequest, UpdateUnitRequest>({
  basePath: '/v1/units',
})

export const unitsApi = {
  ...baseApi,

  list: (params?: {
    page?: number
    pageSize?: number
    search?: string
    type?: 'WEIGHT' | 'VOLUME' | 'QUANTITY'
    status?: string
    sortBy?: 'id' | 'name' | 'type' | 'createdAt'
    sortOrder?: 'asc' | 'desc'
  }) => baseApi.list(params),
}

import { apiClient } from './client'
import type {
  PriceSearchRequest,
  PriceSearchResponse,
  PriceSearchRequestV2,
  PriceSearchResponseV2,
  PriceRecord,
  PriceRecordListResponse,
  CreatePriceRecordRequest,
  UpdatePriceRecordRequest,
} from '@/types/api'

export const pricesApi = {
  search: (body: PriceSearchRequest) =>
    apiClient.post<PriceSearchResponse>('/v1/prices/search', body).then((r) => r.data),

  searchV2: (body: PriceSearchRequestV2) =>
    apiClient.post<PriceSearchResponseV2>('/v2/prices/search', body).then((r) => r.data),

  getRecord: (priceId: number) =>
    apiClient.get<PriceRecord>(`/v1/prices/${priceId}`).then((r) => r.data),

  updateRecord: (priceId: number, body: UpdatePriceRecordRequest) =>
    apiClient.put<PriceRecord>(`/v1/prices/${priceId}`, body).then((r) => r.data),

  deleteRecord: (priceId: number) =>
    apiClient.delete(`/v1/prices/${priceId}`).then((r) => r.data),

  listProductPrices: (
    productId: number,
    params?: {
      storeId?: number
      from?: string
      to?: string
      isPromo?: boolean
      status?: string
      page?: number
      pageSize?: number
      sortBy?: 'price' | 'dateRecorded' | 'storeId'
      sortOrder?: 'asc' | 'desc'
    },
  ) =>
    apiClient.get<PriceRecordListResponse>(`/v1/products/${productId}/prices`, { params }).then((r) => r.data),

  createRecord: (productId: number, body: CreatePriceRecordRequest) =>
    apiClient.post<PriceRecord>(`/v1/products/${productId}/prices`, body).then((r) => r.data),
}

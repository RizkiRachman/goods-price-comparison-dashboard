import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { pricesApi } from '@/api/prices'
import type { PriceSearchRequest, PriceSearchRequestV2, CreatePriceRecordRequest, UpdatePriceRecordRequest } from '@/types/api'


// Search queries
export const usePriceSearch = (body: PriceSearchRequest | null) =>
  useQuery({
    queryKey: ['prices', 'search', body],
    queryFn: () => pricesApi.search(body!),
    enabled: body != null,
  })

export const usePriceSearchV2 = (body: PriceSearchRequestV2 | null) =>
  useQuery({
    queryKey: ['prices', 'searchV2', body],
    queryFn: () => pricesApi.searchV2(body!),
    enabled: body != null,
  })

// Detail query using factory
export const usePriceRecord = (priceId: number | null) =>
  useQuery({
    queryKey: ['prices', priceId],
    queryFn: () => pricesApi.getRecord(priceId!),
    enabled: priceId != null,
  })

// Product prices query
export const useProductPrices = (
  productId: number | null,
  params?: Parameters<typeof pricesApi.listProductPrices>[1]
) =>
  useQuery({
    queryKey: ['products', productId, 'prices', params],
    queryFn: () => pricesApi.listProductPrices(productId!, params),
    enabled: productId != null,
  })

// Mutations
export const useCreatePriceRecord = (productId: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: CreatePriceRecordRequest) => pricesApi.createRecord(productId, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products', productId, 'prices'] })
      qc.invalidateQueries({ queryKey: ['prices', 'search'] })
    },
  })
}

export const useUpdatePriceRecord = (priceId: number, productId?: number | null) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: UpdatePriceRecordRequest) => pricesApi.updateRecord(priceId, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['prices', priceId] })
      qc.invalidateQueries({ queryKey: ['prices', 'search'] })
      if (productId != null) {
        qc.invalidateQueries({ queryKey: ['products', productId, 'prices'] })
      }
    },
  })
}

export const useDeletePriceRecord = (productId?: number | null) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (priceId: number) => pricesApi.deleteRecord(priceId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['prices'] })
      if (productId != null) {
        qc.invalidateQueries({ queryKey: ['products', productId, 'prices'] })
      }
    },
  })
}

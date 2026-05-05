import { useMutation, useQueryClient } from '@tanstack/react-query'
import { pricesApi } from '@/api/prices'
import type { CreatePriceRecordRequest } from '@/types/api'

export function usePriceCorrection(productId: number, storeId: number) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (body: CreatePriceRecordRequest) => pricesApi.createRecord(productId, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products', productId] })
      qc.invalidateQueries({ queryKey: ['products', { storeId }] })
      qc.invalidateQueries({ queryKey: ['prices', productId] })
    },
  })
}

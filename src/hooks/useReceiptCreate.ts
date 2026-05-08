import { useMutation } from '@tanstack/react-query'
import { receiptsApi } from '@/api/receipts'
import type { ReceiptCreateRequest } from '@/types/api'

export function useReceiptCreate() {
  return useMutation({
    mutationFn: (body: ReceiptCreateRequest) => receiptsApi.create(body),
  })
}

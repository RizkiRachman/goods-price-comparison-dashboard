import { useMutation } from '@tanstack/react-query'
import { receiptsApi } from '@/api/receipts'
import type { ReceiptCorrectRequest } from '@/types/api'

export function useReceiptCorrection() {
  return useMutation({
    mutationFn: ({ receiptId, body }: { receiptId: string; body: ReceiptCorrectRequest }) =>
      receiptsApi.correct(receiptId, body),
  })
}

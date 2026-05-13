import { useMutation } from '@tanstack/react-query'
import { receiptsApi } from '@/api/receipts'
import type { BillSplitRequest, BillSplitResponse } from '@/types/api'
import type { AxiosError } from 'axios'

interface SplitBillVariables {
  receiptId: string
  body: BillSplitRequest
}

export function useBillSplit() {
  return useMutation<BillSplitResponse, AxiosError, SplitBillVariables>({
    mutationFn: ({ receiptId, body }) => receiptsApi.splitBill(receiptId, body),
  })
}

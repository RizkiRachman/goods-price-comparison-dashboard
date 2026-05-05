import type {
  ReceiptStatus as ApiReceiptStatus,
  ReceiptResultResponse,
  TrackedJob as ApiTrackedJob,
} from './api'

export type ReceiptStatus = ApiReceiptStatus

export interface ReceiptJob {
  receiptId: string
  status: ReceiptStatus
  message: string | null
}

export type ReceiptResultItem = ReceiptResultResponse['items'][number]

export type ReceiptResult = ReceiptResultResponse

export type TrackedJob = ApiTrackedJob

import { apiClient } from './client'
import type {
  ReceiptUploadResponse,
  ReceiptStatusResponse,
  ReceiptResultResponse,
  ReceiptApproveResponse,
  ReceiptRejectRequest,
  ReceiptRejectResponse,
  ReceiptCorrectRequest,
  ReceiptCorrectResponse,
} from '@/types/api'

export const receiptsApi = {
  upload: (file: File) => {
    const form = new FormData()
    form.append('image', file)
    return apiClient
      .post<ReceiptUploadResponse>('/v1/receipts/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data)
  },

  getStatus: (id: string) =>
    apiClient.get<ReceiptStatusResponse>(`/v1/receipts/${id}/status`).then((r) => r.data),

  getResults: (id: string) =>
    apiClient.get<ReceiptResultResponse>(`/v1/receipts/${id}/results`).then((r) => r.data),

  approve: (id: string) =>
    apiClient.post<ReceiptApproveResponse>(`/v1/receipts/${id}/approve`).then((r) => r.data),

  reject: (id: string, body?: ReceiptRejectRequest) =>
    apiClient.post<ReceiptRejectResponse>(`/v1/receipts/${id}/reject`, body).then((r) => r.data),

  correct: (id: string, body: ReceiptCorrectRequest) =>
    apiClient.post<ReceiptCorrectResponse>(`/v1/receipts/${id}/correct`, body).then((r) => r.data),
}

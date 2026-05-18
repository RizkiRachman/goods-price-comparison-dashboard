import { apiClient } from './client'
import type {
  CreateFeedbackQuestionRequest,
  FeedbackQuestion,
  FeedbackQuestionListResponse,
} from '@/types/api'

export const feedbackApi = {
  create: (body: CreateFeedbackQuestionRequest) =>
    apiClient.post<FeedbackQuestion>('/v1/feedback-questions', body).then((r) => r.data),

  list: (params?: { page?: number; pageSize?: number; sortBy?: string; sortOrder?: string }) =>
    apiClient.get<FeedbackQuestionListResponse>('/v1/feedback-questions', { params }).then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<FeedbackQuestion>(`/v1/feedback-questions/${id}`).then((r) => r.data),
}

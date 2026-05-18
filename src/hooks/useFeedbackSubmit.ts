import { useMutation } from '@tanstack/react-query'
import { feedbackApi } from '@/api/feedback'
import type { CreateFeedbackQuestionRequest } from '@/types/api'

export const useFeedbackSubmit = () =>
  useMutation({
    mutationFn: (body: CreateFeedbackQuestionRequest) => feedbackApi.create(body),
  })

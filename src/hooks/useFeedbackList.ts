import { useQuery } from '@tanstack/react-query'
import { feedbackApi } from '@/api/feedback'

interface UseFeedbackListParams {
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: string
}

export const useFeedbackList = (params?: UseFeedbackListParams) =>
  useQuery({
    queryKey: ['feedback', params],
    queryFn: () => feedbackApi.list(params),
    refetchOnMount: 'always',
  })

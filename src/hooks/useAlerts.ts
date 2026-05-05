import { useMutation } from '@tanstack/react-query'
import { alertsApi } from '@/api/alerts'
import type { AlertSubscriptionRequest } from '@/types/api'

export const useSubscribeAlert = () =>
  useMutation({
    mutationFn: (body: AlertSubscriptionRequest) => alertsApi.subscribe(body),
  })

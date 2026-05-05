import { useQuery } from '@tanstack/react-query'
import { systemApi } from '@/api/system'

export const useApiVersion = () =>
  useQuery({
    queryKey: ['system', 'version'],
    queryFn: systemApi.getVersion,
    staleTime: 300_000,
  })

export const useHealth = () =>
  useQuery({
    queryKey: ['system', 'health'],
    queryFn: systemApi.getHealth,
    refetchInterval: 30_000,
  })

export const useMetrics = () =>
  useQuery({
    queryKey: ['system', 'metrics'],
    queryFn: systemApi.getMetrics,
    refetchInterval: 60_000,
  })

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from '@tanstack/react-query'
import type { AxiosError } from 'axios'

/**
 * Generic query options factory
 */
export interface EntityQueryOptions {
  queryKey: string
  enabled?: boolean
  staleTime?: number
}

/**
 * Create a standardized list query hook
 */
export function createListQueryHook<
  TParams extends Record<string, unknown> | undefined,
  TResponse,
>(
  queryKey: string,
  fetchFn: (params?: TParams) => Promise<TResponse>,
  defaultOptions?: Omit<UseQueryOptions<TResponse, AxiosError, TResponse, unknown[]>, 'queryKey' | 'queryFn'>
) {
  return function useListQuery(params?: TParams) {
    return useQuery({
      queryKey: [queryKey, params],
      queryFn: () => fetchFn(params),
      ...defaultOptions,
    })
  }
}

/**
 * Create a standardized detail query hook
 */
export function createDetailQueryHook<TData>(
  queryKey: string,
  fetchFn: (id: number | string) => Promise<TData>,
  defaultOptions?: Omit<UseQueryOptions<TData, AxiosError, TData, unknown[]>, 'queryKey' | 'queryFn'>
) {
  return function useDetailQuery(id: number | string | null) {
    return useQuery({
      queryKey: [queryKey, id],
      queryFn: () => fetchFn(id!),
      enabled: id != null,
      ...defaultOptions,
    })
  }
}

/**
 * Create a standardized create mutation hook
 */
export function createCreateMutationHook<TCreate, TData>(
  queryKey: string,
  mutateFn: (body: TCreate) => Promise<TData>,
  options?: Omit<UseMutationOptions<TData, AxiosError, TCreate>, 'mutationFn'>
) {
  return function useCreateMutation() {
    const qc = useQueryClient()

    return useMutation({
      mutationFn: mutateFn,
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: [queryKey] })
      },
      ...options,
    })
  }
}

/**
 * Create a standardized update mutation hook
 */
export function createUpdateMutationHook<TUpdate, TData>(
  queryKey: string,
  mutateFn: (id: number | string, body: TUpdate) => Promise<TData>,
  options?: Omit<UseMutationOptions<TData, AxiosError, { id: number | string; body: TUpdate }>, 'mutationFn'>
) {
  return function useUpdateMutation() {
    const qc = useQueryClient()

    return useMutation({
      mutationFn: ({ id, body }: { id: number | string; body: TUpdate }) =>
        mutateFn(id, body),
      onSuccess: (_, variables) => {
        qc.invalidateQueries({ queryKey: [queryKey, variables.id] })
        qc.invalidateQueries({ queryKey: [queryKey] })
      },
      ...options,
    })
  }
}

/**
 * Create a standardized delete mutation hook
 */
export function createDeleteMutationHook(
  queryKey: string,
  mutateFn: (id: number | string) => Promise<unknown>,
  options?: Omit<UseMutationOptions<unknown, AxiosError, number | string>, 'mutationFn'>
) {
  return function useDeleteMutation() {
    const qc = useQueryClient()

    return useMutation({
      mutationFn: mutateFn,
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: [queryKey] })
      },
      ...options,
    })
  }
}

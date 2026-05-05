import {
  createListQueryHook,
  createDetailQueryHook,
  createCreateMutationHook,
  createUpdateMutationHook,
  createDeleteMutationHook,
} from '@/lib/query-factory'
import { storesApi } from '@/api/stores'
import type { Store, StoreListResponse, CreateStoreRequest, UpdateStoreRequest } from '@/types/api'
import { useQuery } from '@tanstack/react-query'

// List query
export const useStores = createListQueryHook<
  Parameters<typeof storesApi.list>[0],
  StoreListResponse
>('stores', storesApi.list)

// Detail query
export const useStore = createDetailQueryHook<Store>('stores', storesApi.get)

// Chain query - specific to stores
export const useStoreChains = () =>
  useQuery({
    queryKey: ['stores', 'chains'],
    queryFn: storesApi.getChains,
  })

// Mutations
export const useCreateStore = createCreateMutationHook<CreateStoreRequest, Store>(
  'stores',
  storesApi.create
)

export const useUpdateStore = createUpdateMutationHook<UpdateStoreRequest, Store>(
  'stores',
  storesApi.update
)

export const useDeleteStore = createDeleteMutationHook('stores', storesApi.delete)

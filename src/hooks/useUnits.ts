import {
  createListQueryHook,
  createDetailQueryHook,
  createCreateMutationHook,
  createUpdateMutationHook,
  createDeleteMutationHook,
} from '@/lib/query-factory'
import { unitsApi } from '@/api/units'
import type { Unit, UnitListResponse, CreateUnitRequest, UpdateUnitRequest } from '@/types/api'

export const useUnitsList = createListQueryHook<
  Parameters<typeof unitsApi.list>[0],
  UnitListResponse
>('units', unitsApi.list, { refetchOnMount: 'always' })

export const useUnit = createDetailQueryHook<Unit>('units', unitsApi.get, { refetchOnMount: 'always' })

export const useCreateUnit = createCreateMutationHook<CreateUnitRequest, Unit>(
  'units',
  unitsApi.create,
)

export const useUpdateUnit = createUpdateMutationHook<UpdateUnitRequest, Unit>(
  'units',
  unitsApi.update,
)

export const useDeleteUnit = createDeleteMutationHook('units', unitsApi.delete)

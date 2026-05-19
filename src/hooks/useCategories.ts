import {
  createListQueryHook,
  createDetailQueryHook,
  createCreateMutationHook,
  createUpdateMutationHook,
  createDeleteMutationHook,
} from '@/lib/query-factory'
import { categoriesApi } from '@/api/categories'
import type { Category, CategoryListResponse, CreateCategoryRequest, UpdateCategoryRequest } from '@/types/api'

export const useCategoriesList = createListQueryHook<
  Parameters<typeof categoriesApi.list>[0],
  CategoryListResponse
>('categories', categoriesApi.list, { refetchOnMount: 'always' })

export const useCategory = createDetailQueryHook<Category>('categories', categoriesApi.get, { refetchOnMount: 'always' })

export const useCreateCategory = createCreateMutationHook<CreateCategoryRequest, Category>(
  'categories',
  categoriesApi.create,
)

export const useUpdateCategory = createUpdateMutationHook<UpdateCategoryRequest, Category>(
  'categories',
  categoriesApi.update,
)

export const useDeleteCategory = createDeleteMutationHook('categories', categoriesApi.delete)

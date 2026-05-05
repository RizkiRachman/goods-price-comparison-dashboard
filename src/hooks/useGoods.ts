import {
  createListQueryHook,
  createDetailQueryHook,
  createCreateMutationHook,
  createUpdateMutationHook,
  createDeleteMutationHook,
} from '@/lib/query-factory'
import { productsApi } from '@/api/products'
import type { Product, ProductListResponse, CreateProductRequest, UpdateProductRequest } from '@/types/api'

// List query
export const useProducts = createListQueryHook<
  Parameters<typeof productsApi.list>[0],
  ProductListResponse
>('products', productsApi.list)

// Detail query
export const useProduct = createDetailQueryHook<Product>('products', productsApi.get)

// Trend query - custom since it has different params
export const useProductTrend = (
  productId: number | null,
  params?: Parameters<typeof productsApi.getTrend>[1]
) =>
  createListQueryHook(`products/${productId}/trend`, () => productsApi.getTrend(productId!, params))()

// Mutations
export const useCreateProduct = createCreateMutationHook<CreateProductRequest, Product>(
  'products',
  productsApi.create
)

export const useUpdateProduct = createUpdateMutationHook<UpdateProductRequest, Product>(
  'products',
  productsApi.update
)

export const useDeleteProduct = createDeleteMutationHook('products', productsApi.delete)

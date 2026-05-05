import { useQuery } from '@tanstack/react-query'
import { productsApi } from '@/api/products'


export function useProductsByStore(storeId: number | null, params?: { page?: number; pageSize?: number }) {
  return useQuery({
    queryKey: ['products', 'store', storeId, params],
    queryFn: () => productsApi.list({ ...params, storeId: storeId!, includePrice: true }),
    enabled: storeId != null,
  })
}

import { useQuery } from '@tanstack/react-query'
import { shoppingApi } from '@/api/shopping'
import type { ShoppingOptimizeRequest } from '@/types/api'

export const useShoppingOptimization = (body: ShoppingOptimizeRequest | null) =>
  useQuery({
    queryKey: ['shopping', 'optimize', body],
    queryFn: () => shoppingApi.optimize(body!),
    enabled: body != null && body.items.length > 0,
  })

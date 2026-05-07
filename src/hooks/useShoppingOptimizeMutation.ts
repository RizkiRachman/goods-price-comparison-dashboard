import { useMutation } from '@tanstack/react-query'
import { shoppingApi } from '@/api/shopping'
import type { ShoppingOptimizeRequest, ShoppingOptimizeResponse } from '@/types/api'

export const useShoppingOptimizeMutation = () =>
  useMutation<ShoppingOptimizeResponse, Error, ShoppingOptimizeRequest>({
    mutationFn: (body) => shoppingApi.optimize(body),
  })

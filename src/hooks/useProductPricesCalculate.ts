import { useMutation } from '@tanstack/react-query'
import { adminApi } from '@/api/admin'

export function useProductPricesCalculate() {
  return useMutation({
    mutationFn: () => adminApi.calculateProductPrices(),
  })
}

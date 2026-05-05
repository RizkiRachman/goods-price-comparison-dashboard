import { useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '@/api/admin'

export function useProductPricesCalculate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => adminApi.calculateProductPrices(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

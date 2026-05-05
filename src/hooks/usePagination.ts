import { useState, useCallback } from 'react'

interface UsePaginationOptions {
  initialPage?: number
  pageSize?: number
}

interface UsePaginationReturn {
  page: number
  pageSize: number
  setPage: (page: number) => void
  resetPage: () => void
  pageParam: { page: number; pageSize: number }
}

/**
 * Hook for managing pagination state
 */
export function usePagination(options: UsePaginationOptions = {}): UsePaginationReturn {
  const { initialPage = 1, pageSize = 8 } = options
  const [page, setPageState] = useState(initialPage)

  const setPage = useCallback((newPage: number) => {
    setPageState(newPage)
  }, [])

  const resetPage = useCallback(() => {
    setPageState(initialPage)
  }, [initialPage])

  return {
    page,
    pageSize,
    setPage,
    resetPage,
    pageParam: { page, pageSize },
  }
}

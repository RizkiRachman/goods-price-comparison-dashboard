import { useDebounce } from '@/hooks/useDebounce'
import { usePagination } from '@/hooks/usePagination'
import { useState, useMemo } from 'react'
import { useProducts } from '@/hooks/useGoods'
import { useStores } from '@/hooks/useStores'
import { normalizeUnit, normalizeCategory } from '@/utils/goods'

export type SearchMode = 'product' | 'store'

export function useSearchMode() {
  const [searchMode, setSearchMode] = useState<SearchMode>('product')

  const handleModeChange = (mode: SearchMode) => {
    setSearchMode(mode)
  }

  return { searchMode, setSearchMode, handleModeChange }
}

export function useProductSearch() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const debouncedSearch = useDebounce(search, 300)

  const handleSearchChange = (value: string) => {
    setSearch(value)
  }

  const handleCategoryChange = (value: string) => {
    setCategory(value)
  }

  return {
    search,
    debouncedSearch,
    category,
    setSearch,
    setCategory,
    handleSearchChange,
    handleCategoryChange,
  }
}

export function useStoreSearch() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)

  const handleSearchChange = (value: string) => {
    setSearch(value)
  }

  return {
    search,
    debouncedSearch,
    setSearch,
    handleSearchChange,
  }
}

export function useSearchLogic() {
  const { searchMode, handleModeChange } = useSearchMode()
  const productSearch = useProductSearch()
  const storeSearch = useStoreSearch()
  const { page, setPage, resetPage } = usePagination({ pageSize: 10 })

  const handleProductSearchChange = (value: string) => {
    productSearch.handleSearchChange(value)
    resetPage()
  }

  const handleStoreSearchChange = (value: string) => {
    storeSearch.handleSearchChange(value)
    resetPage()
  }

  const handleCategoryChange = (value: string) => {
    productSearch.handleCategoryChange(value)
    resetPage()
  }

  const handleModeChangeWithReset = (mode: SearchMode) => {
    handleModeChange(mode)
    resetPage()
    // Clear the other search
    if (mode === 'product') {
      storeSearch.setSearch('')
    } else {
      productSearch.setSearch('')
    }
  }

  const productParams = useMemo(
    () => ({
      page: page,
      pageSize: 10,
      includePrice: true,
      search: productSearch.debouncedSearch || undefined,
      category: productSearch.category !== 'All' ? productSearch.category : undefined,
    }),
    [page, productSearch.debouncedSearch, productSearch.category]
  )

  const storeParams = useMemo(
    () => ({
      page: page,
      pageSize: 10,
      search: storeSearch.debouncedSearch || undefined,
    }),
    [page, storeSearch.debouncedSearch]
  )

  const { data: productsData, isLoading: isLoadingProducts, isError: isErrorProducts } = useProducts(
    searchMode === 'product' ? productParams : undefined
  )

  const { data: storesData, isLoading: isLoadingStores, isError: isErrorStores } = useStores(
    searchMode === 'store' ? storeParams : undefined
  )

  const goods = useMemo(
    () =>
      (productsData?.data ?? []).map((p) => {
        const avgPrice = p.detail?.price?.avg ?? p.avgPrice ?? 0
        const lowestPrice = p.detail?.price?.min ?? p.lowestPrice ?? 0
        const highestPrice = p.detail?.price?.max ?? p.highestPrice ?? 0
        const latestDate = p.detail?.price?.updatedAt ?? p.latestDate ?? new Date().toISOString()

        return {
          goodId: String(p.id),
          goodName: p.name,
          category: normalizeCategory(p.category),
          unit: normalizeUnit(p.unit),
          latestPrice: p.latestPrice ?? 0,
          avgPrice,
          lowestPrice,
          highestPrice,
          latestStore: {
            id: String(p.latestStore?.id ?? 0),
            name: p.latestStore?.name ?? '-',
            location: p.latestStore?.location ?? '-',
            city: p.latestStore?.location ?? '-',
          },
          latestDate,
          totalReports: p.totalReports ?? 0,
        }
      }),
    [productsData]
  )

  const categories = useMemo(() => [...new Set(goods.map((g) => g.category))], [goods])

  const isLoading = searchMode === 'product' ? isLoadingProducts : isLoadingStores
  const isError = searchMode === 'product' ? isErrorProducts : isErrorStores
  const pagination = searchMode === 'product' ? productsData?.pagination : storesData?.pagination
  const totalItems = pagination?.totalItems ?? 0

  return {
    searchMode,
    productSearch,
    storeSearch,
    page,
    setPage,
    goods,
    categories,
    storesData,
    isLoading,
    isError,
    pagination,
    totalItems,
    handleModeChange: handleModeChangeWithReset,
    handleProductSearchChange,
    handleStoreSearchChange,
    handleCategoryChange,
  }
}

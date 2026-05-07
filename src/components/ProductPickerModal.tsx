import { useState, useMemo } from 'react'
import { useProducts } from '@/hooks/useGoods'
import { Pagination } from './Pagination'
import { SkeletonCard } from './SkeletonCard'
import type { Product } from '@/types/api'

interface Props {
  onClose: () => void
  onSelect: (product: Product) => void
  excludeIds?: number[]
}

const PAGE_SIZE = 10

const CATEGORY_COLORS: Record<string, { tint: string; emoji: string }> = {
  food:          { tint: 'bg-emerald-50',  emoji: '🍽️' },
  beverage:      { tint: 'bg-sky-50',      emoji: '🥤' },
  household:     { tint: 'bg-violet-50',   emoji: '🏠' },
}
const DEFAULT_COLOR = { tint: 'bg-slate-50', emoji: '📦' }

export function ProductPickerModal({ onClose, onSelect, excludeIds = [] }: Props) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const params = useMemo(
    () => ({
      page,
      pageSize: PAGE_SIZE,
      search,
    }),
    [page, search],
  )

  const { data, isLoading, isError } = useProducts(params)

  const products = data?.data ?? []
  const pagination = data?.pagination

  const filtered = products.filter((p) => !excludeIds.includes(p.id))

  function handleSearch(val: string) {
    setSearch(val)
    setPage(1)
  }

  function handleSelect(product: Product) {
    onSelect(product)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[85vh] sm:max-h-[600px]">
        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* Header */}
        <div className="px-6 pt-4 pb-2 sm:pt-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Pilih Barang</h2>
              <p className="text-sm text-gray-400 mt-0.5">Cari dan pilih barang dari katalog</p>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 transition flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search */}
          <div className="mt-4 relative">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Cari barang..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {isLoading && (
            <div className="grid grid-cols-1 gap-3 mt-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {isError && (
            <div className="text-center py-10">
              <p className="text-slate-600 font-semibold">Gagal memuat barang</p>
              <p className="text-slate-400 text-sm mt-1">Periksa koneksi atau coba lagi</p>
            </div>
          )}

          {!isLoading && !isError && filtered.length === 0 && (
            <div className="text-center py-10">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-slate-600 font-semibold">Barang tidak ditemukan</p>
              <p className="text-slate-400 text-sm mt-1">Coba kata kunci yang berbeda</p>
            </div>
          )}

          {!isLoading && !isError && filtered.length > 0 && (
            <div className="mt-4 space-y-2">
              {filtered.map((product) => {
                const color = CATEGORY_COLORS[product.category ?? ''] ?? DEFAULT_COLOR
                return (
                  <button
                    key={product.id}
                    onClick={() => handleSelect(product)}
                    className="w-full text-left flex items-center gap-3 px-4 py-3 bg-white border border-slate-100 rounded-2xl hover:border-indigo-300 hover:shadow-sm hover:bg-indigo-50/30 transition-all group"
                  >
                    <div className={`w-10 h-10 ${color.tint} rounded-xl flex items-center justify-center text-lg flex-shrink-0`}>
                      {color.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 text-sm group-hover:text-indigo-700 transition-colors truncate">
                        {product.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {product.brand && (
                          <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                            {product.brand}
                          </span>
                        )}
                        <span className="text-[10px] font-medium text-slate-400 uppercase">
                          {product.category ?? 'uncategorized'}
                        </span>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )
              })}
            </div>
          )}

          {pagination && (
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>
    </div>
  )
}

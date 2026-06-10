import { useState, useMemo } from 'react'
import { motion } from 'motion/react'
import { useProducts } from '@/hooks/useGoods'
import { Pagination } from './Pagination'
import type { Product } from '@/types/api'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { ModalShell } from '@/components/ui/ModalShell'

interface Props {
  onClose: () => void
  onSelect: (product: Product) => void
  excludeIds?: number[]
}

const PAGE_SIZE = 10

const CATEGORY_COLORS: Record<string, { tint: string; emoji: string }> = {
  food:          { tint: 'bg-emerald-50',  emoji: '🍽️' },
  beverage:      { tint: 'bg-retro-bg/50',      emoji: '🥤' },
  household:     { tint: 'bg-amber-50/30',   emoji: '🏠' },
}
const DEFAULT_COLOR = { tint: 'bg-retro-bg', emoji: '📦' }

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
    <ModalShell open={true} onClose={onClose} variant="sheet">
      {/* Header */}
      <div className="px-6 pt-4 pb-2 sm:pt-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-retro-text">Pilih Barang</h2>
            <p className="text-sm text-retro-muted mt-0.5">Cari dan pilih barang dari katalog</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-none text-retro-muted hover:bg-retro-surface/80 transition flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="mt-4 relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-retro-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Cari barang..."
            className="w-full pl-10 pr-4 py-2.5 bg-retro-surface/60 backdrop-blur-sm border border-retro-border rounded-none text-sm text-retro-text placeholder:text-retro-muted focus:outline-none focus:ring-2 focus:ring-retro-gold focus:border-transparent transition"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {isLoading && (
          <div className="grid grid-cols-1 gap-3 mt-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}

        {isError && (
          <div className="text-center py-10">
            <p className="text-retro-body font-semibold">Gagal memuat barang</p>
            <p className="text-retro-muted text-sm mt-1">Periksa koneksi atau coba lagi</p>
          </div>
        )}

        {!isLoading && !isError && filtered.length === 0 && (
          <div className="text-center py-10">
            <div className="w-12 h-12 bg-retro-surface rounded-none flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-retro-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-retro-body font-semibold">Barang tidak ditemukan</p>
            <p className="text-retro-muted text-sm mt-1">Coba kata kunci yang berbeda</p>
          </div>
        )}

        {!isLoading && !isError && filtered.length > 0 && (
          <div className="mt-4 space-y-2">
            {filtered.map((product) => {
              const color = CATEGORY_COLORS[product.category ?? ''] ?? DEFAULT_COLOR
              return (
                <motion.button
                  key={product.id}
                  onClick={() => handleSelect(product)}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full text-left flex items-center gap-3 px-4 py-3 bg-retro-surface/60 backdrop-blur-sm border border-retro-border/20 rounded-none hover:border-retro-gold/70 hover:bg-amber-50/30/30 transition-colors group"
                >
                  <div className={`w-10 h-10 ${color.tint} backdrop-blur rounded-none flex items-center justify-center text-lg flex-shrink-0`}>
                    {color.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-retro-text text-sm group-hover:text-retro-gold transition-colors truncate">
                      {product.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {product.brand && (
                        <span className="text-[10px] font-medium text-retro-muted bg-retro-surface/70 backdrop-blur px-2 py-0.5 rounded-none border border-retro-border/50">
                          {product.brand}
                        </span>
                      )}
                      <span className="text-[10px] font-medium text-retro-muted uppercase">
                        {product.category ?? 'uncategorized'}
                      </span>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-slate-300 group-hover:text-retro-gold transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
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
    </ModalShell>
  )
}

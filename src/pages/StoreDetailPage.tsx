import { useParams, Link } from 'react-router-dom'
import { useStore } from '@/hooks/useStores'
import { useProductsByStore } from '@/hooks/useProductsByStore'
import { usePagination } from '@/hooks/usePagination'
import { GoodCard } from '@/components/GoodCard'
import { Pagination } from '@/components/Pagination'
import { PriceCorrectModal } from '@/components/PriceCorrectModal'
import { normalizeUnit, normalizeCategory } from '@/utils/goods'
import { useMemo, useState } from 'react'

interface CorrectTarget {
  productId: number
  productName: string
  currentPrice?: number
  unit?: string
}

export default function StoreDetailPage() {
  const { storeId } = useParams<{ storeId: string }>()
  const id = storeId ? Number(storeId) : null
  const { data: store } = useStore(id)
  const { page, setPage, pageParam } = usePagination({ pageSize: 10 })
  const { data: productsData, isLoading, isError } = useProductsByStore(id, pageParam)
  const [correctTarget, setCorrectTarget] = useState<CorrectTarget | null>(null)

  const goods = useMemo(
    () =>
      (productsData?.data ?? []).map((p) => ({
        goodId: String(p.id),
        productId: p.id,
        goodName: p.name,
        category: normalizeCategory(p.category),
        unit: normalizeUnit(p.unit),
        latestPrice: p.latestPrice ?? 0,
        avgPrice: p.detail?.price?.avg ?? p.avgPrice ?? 0,
        lowestPrice: p.detail?.price?.min ?? p.lowestPrice ?? 0,
        highestPrice: p.detail?.price?.max ?? p.highestPrice ?? 0,
        latestStore: { id: String(id ?? 0), name: store?.name ?? '', location: store?.location ?? '', city: '' },
        latestDate: p.detail?.price?.updatedAt ?? p.latestDate ?? new Date().toISOString(),
        totalReports: p.totalReports ?? 0,
      })),
    [productsData, id, store]
  )

  const totalItems = productsData?.pagination?.totalItems ?? 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100/50">
      <header className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12 relative">
          <Link
            to="/goods"
            className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-4 transition-all hover:gap-2.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Kembali
          </Link>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{store?.name ?? 'Toko'}</h1>
          {store?.location && <p className="text-white/60 text-sm mt-1">{store.location}</p>}
          {store?.chain && (
            <span className="inline-block mt-2 text-xs font-medium bg-white/20 px-2.5 py-1 rounded-lg backdrop-blur">
              {store.chain}
            </span>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 pb-12">
        {!isLoading && !isError && totalItems > 0 && (
          <p className="text-sm text-gray-400 mb-4">
            Menampilkan <span className="font-semibold text-gray-700">{totalItems}</span> produk
          </p>
        )}

        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 overflow-visible">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-1.5 bg-gray-200" />
                <div className="p-3 space-y-2">
                  <div className="flex items-start gap-2.5">
                    <div className="w-9 h-9 bg-gray-200 rounded-lg flex-shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3.5 bg-gray-200 rounded w-3/4" />
                      <div className="h-2.5 bg-gray-100 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="h-5 bg-gray-100 rounded w-24" />
                </div>
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">Gagal memuat data</p>
            <p className="text-gray-400 text-sm mt-1">Coba muat ulang halaman</p>
          </div>
        )}

        {!isLoading && !isError && goods.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 overflow-visible">
              {goods.map((good, index) => (
                <div
                  key={good.goodId}
                  className="relative group/correct"
                  style={{ animation: `fade-in-up 0.3s ease-out ${index * 40}ms both` }}
                >
                  <GoodCard good={good} />
                  <button
                    onClick={() => setCorrectTarget({
                      productId: good.productId,
                      productName: good.goodName,
                      currentPrice: good.latestPrice || good.avgPrice || undefined,
                      unit: good.unit,
                    })}
                    aria-label={`Koreksi harga ${good.goodName}`}
                    className="absolute bottom-2 right-2 opacity-0 group-hover/correct:opacity-100 focus:opacity-100 transition-opacity flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Koreksi
                  </button>
                </div>
              ))}
            </div>
            {productsData?.pagination && (
              <Pagination page={page} totalPages={productsData.pagination.totalPages} onPageChange={setPage} />
            )}
          </>
        )}

        {correctTarget && id && (
          <PriceCorrectModal
            productId={correctTarget.productId}
            productName={correctTarget.productName}
            storeId={id}
            currentPrice={correctTarget.currentPrice}
            unit={correctTarget.unit}
            onClose={() => setCorrectTarget(null)}
          />
        )}

        {!isLoading && !isError && goods.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-2.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">Belum ada produk</p>
            <p className="text-gray-400 text-sm mt-1">Belum ada produk yang tercatat di toko ini</p>
          </div>
        )}
      </main>
    </div>
  )
}

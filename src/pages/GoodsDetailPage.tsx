import { useParams, Link } from 'react-router-dom'
import { useProductPrices } from '@/hooks/usePrices'
import { useProduct } from '@/hooks/useGoods'
import { ReceiptRow } from '@/components/PriceComponents'
import { formatPrice } from '@/lib/utils'

function PriceSummary({ min, max, latest, unit }: { min: number; max: number; latest: number; unit?: string }) {
  const unitLabel = unit ? ` /${unit}` : ''

  return (
    <div className="grid grid-cols-3 gap-3 mb-8">
      <div className="bg-white/90 backdrop-blur rounded-2xl p-4 shadow-lg shadow-black/5 border border-gray-100">
        <p className="text-emerald-600 text-xs font-semibold mb-1">Terendah</p>
        <p className="text-xl font-extrabold tracking-tight text-gray-900">{formatPrice(min)}</p>
        <p className="text-gray-400 text-xs mt-0.5">{unitLabel}</p>
      </div>
      <div className="bg-white/90 backdrop-blur rounded-2xl p-4 shadow-lg shadow-black/5 border border-gray-100">
        <p className="text-indigo-600 text-xs font-semibold mb-1">Terbaru</p>
        <p className="text-xl font-extrabold tracking-tight text-gray-900">{formatPrice(latest)}</p>
        <p className="text-gray-400 text-xs mt-0.5">{unitLabel}</p>
      </div>
      <div className="bg-white/90 backdrop-blur rounded-2xl p-4 shadow-lg shadow-black/5 border border-gray-100">
        <p className="text-red-500 text-xs font-semibold mb-1">Tertinggi</p>
        <p className="text-xl font-extrabold tracking-tight text-gray-900">{formatPrice(max)}</p>
        <p className="text-gray-400 text-xs mt-0.5">{unitLabel}</p>
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="grid grid-cols-3 gap-3 mb-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-2xl bg-gray-200 h-24" />
        ))}
      </div>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex justify-between">
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-32" />
              <div className="h-3 bg-gray-100 rounded w-24" />
            </div>
            <div className="h-6 bg-gray-200 rounded w-24" />
          </div>
        </div>
      ))}
    </div>
  )
}

function ErrorState() {
  return (
    <div className="text-center py-20">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <p className="text-gray-500 font-medium">Gagal memuat data harga</p>
      <p className="text-gray-400 text-sm mt-1">Coba muat ulang halaman</p>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-20">
      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </div>
      <p className="text-gray-500 font-medium">Belum ada data harga</p>
      <p className="text-gray-400 text-sm mt-1">Belum ada catatan harga untuk barang ini</p>
    </div>
  )
}

export default function GoodsDetailPage() {
  const { id } = useParams<{ id: string }>()
  const productId = id ? Number(id) : null
  const { data: product } = useProduct(productId)
  const { data: pricesData, isLoading, isError } = useProductPrices(productId, {
    sortBy: 'price',
    sortOrder: 'asc',
  })

  const sorted = pricesData?.data ?? []
  const min = sorted[0]?.price ?? 0
  const max = sorted[sorted.length - 1]?.price ?? 0
  const goodName = product?.name ?? 'Barang'
  const unit = product?.unit ?? ''

  const latestPrice = sorted.length > 0
    ? sorted.reduce((latest, item) =>
        new Date(item.dateRecorded) > new Date(latest.dateRecorded) ? item : latest
      ).price
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100/50">
      <header className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 pb-10 relative">
          <Link
            to="/goods"
            className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-6 transition-all hover:gap-2.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Kembali
          </Link>

          {!isLoading && (
            <>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{goodName}</h1>
              <p className="text-white/60 text-sm mt-1.5">{sorted.length} catatan harga</p>
            </>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 -mt-5 pb-12">
        {isLoading && <LoadingSkeleton />}

        {isError && <ErrorState />}

        {!isLoading && !isError && sorted.length === 0 && <EmptyState />}

        {!isLoading && !isError && sorted.length > 0 && (
          <>
            <PriceSummary min={min} max={max} latest={latestPrice} unit={unit} />

            <div className="flex items-center justify-between mb-4 px-1">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                Diurutkan dari harga terendah
              </p>
              <p className="text-xs text-gray-400">{sorted.length} hasil</p>
            </div>

            <div className="flex flex-col gap-3">
              {sorted.map((item, index) => (
                <div
                  key={item.id}
                  style={{
                    animation: `fade-in-up 0.3s ease-out ${index * 50}ms both`,
                  }}
                >
                  <ReceiptRow item={item} min={min} max={max} isLowest={item.price === min} />
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useShoppingOptimizeMutation } from '@/hooks/useShoppingOptimizeMutation'
import { ProductPickerModal } from '@/components/ProductPickerModal'
import type { Product, ShoppingOptimizeResponse } from '@/types/api'

const MAX_ITEMS = 5

function StoreResultCard({ result }: { result: ShoppingOptimizeResponse }) {
  return (
    <div className="space-y-4">
      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total Barang</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{result.totalItems}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total Biaya</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            Rp {result.totalCost.toLocaleString('id-ID')}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Toko Dikunjungi</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{result.storesToVisit}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Penghematan</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            Rp {result.savings.comparedToSingleStore.toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      {/* Route per store */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Rute Belanja</h3>
        {result.route.map((store, si) => (
          <div
            key={store.storeId}
            className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center text-sm font-bold text-indigo-600">
                  {si + 1}
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{store.storeName}</p>
                  <p className="text-xs text-slate-400">{store.storeLocation}</p>
                </div>
              </div>
              <p className="font-bold text-emerald-600">
                Rp {store.subtotal.toLocaleString('id-ID')}
              </p>
            </div>
            <div className="space-y-1.5 pl-10">
              {store.items.map((item, ii) => (
                <div key={ii} className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">
                    {item.productName}{' '}
                    {item.quantity > 1 && (
                      <span className="text-slate-400">x{item.quantity}</span>
                    )}
                  </span>
                  <span className="font-medium text-slate-800">
                    Rp {item.price.toLocaleString('id-ID')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Result note */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-sm text-indigo-700 text-center">
        Ini hasil optimum berdasarkan data / catatan harga kami.
      </div>
    </div>
  )
}

export default function GoodsTrackerPage() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<Product[]>([])
  const [showPicker, setShowPicker] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const resultRef = useRef<HTMLDivElement>(null)

  const mutation = useShoppingOptimizeMutation()
  const result = mutation.data

  const handleDownloadImage = useCallback(async () => {
    if (!resultRef.current || !result) return
    setDownloading(true)
    try {
      const { default: html2canvas } = await import('html2canvas')
      const canvas = await html2canvas(resultRef.current, {
        backgroundColor: '#f8fafc',
        scale: 2,
      })
      const link = document.createElement('a')
      link.download = `tracker-belanja-${Date.now()}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch {
      // silently ignore
    } finally {
      setDownloading(false)
    }
  }, [result])

  function handleSelect(product: Product) {
    if (selected.length >= MAX_ITEMS) return
    setSelected((prev) => [...prev, product])
  }

  function handleRemove(idx: number) {
    setSelected((prev) => prev.filter((_, i) => i !== idx))
  }

  function handleOptimize() {
    if (selected.length === 0) return
    mutation.mutate({ items: selected.map((p) => p.name) })
  }

  const excludeIds = selected.map((p) => p.id)
  const canAdd = selected.length < MAX_ITEMS
  const canOptimize = selected.length >= 2 && !mutation.isPending

  const CATEGORY_COLORS: Record<string, { tint: string; emoji: string }> = {
    food:      { tint: 'bg-emerald-50',  emoji: '\uD83C\uDF7D\uFE0F' },
    beverage:  { tint: 'bg-sky-50',      emoji: '\uD83E\uDD64' },
    household: { tint: 'bg-violet-50',   emoji: '\uD83C\uDFE0' },
  }
  const DEFAULT_COLOR = { tint: 'bg-slate-50', emoji: '\uD83D\uDCE6' }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Sticky Navbar ── */}
      <header className="sticky top-0 z-30 h-14 flex items-center bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/goods')}
              className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center transition-colors"
              aria-label="Kembali"
            >
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="font-black text-slate-900 text-lg tracking-tight">Tracker Belanja</span>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute top-16 -left-16 w-56 h-56 bg-purple-400/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14">
          <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur text-white/90 text-xs font-medium px-3 py-1.5 rounded-full mb-5">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            Optimasi belanja lintas toko
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white leading-tight mb-2">
            Cari <span className="text-amber-200">Toko Terbaik</span>
          </h1>
          <p className="text-white/60 text-sm max-w-md mb-6">
            Pilih barang dari katalog, kami akan cari toko terbaik untuk setiap barang — baik di
            satu toko maupun beberapa toko.
          </p>
        </div>
      </section>

      {/* ── Main Content ── */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 pb-24">
        {/* Input section */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-800">Daftar Belanja</h2>
            <span className="text-xs text-slate-400">
              {selected.length}/{MAX_ITEMS}
            </span>
          </div>

          {/* Selected items */}
          {selected.length > 0 && (
            <div className="space-y-2 mb-4">
              {selected.map((product, idx) => {
                const color = CATEGORY_COLORS[product.category ?? ''] ?? DEFAULT_COLOR
                return (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-2xl border border-slate-200"
                  >
                    <span className="w-6 text-xs font-semibold text-slate-400 text-center shrink-0">
                      {idx + 1}.
                    </span>
                    <div className={`w-8 h-8 ${color.tint} rounded-xl flex items-center justify-center text-base flex-shrink-0`}>
                      {color.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 text-sm truncate">{product.name}</p>
                      <p className="text-[10px] text-slate-400">{product.category ?? 'uncategorized'}</p>
                    </div>
                    <button
                      onClick={() => handleRemove(idx)}
                      className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200 text-slate-400 rounded-xl transition-colors flex-shrink-0"
                      aria-label={`Hapus ${product.name}`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )
              })}
            </div>
          )}

          {/* Add & Optimize buttons */}
          <div className="flex items-center gap-3 mt-4">
            {canAdd ? (
              <button
                onClick={() => setShowPicker(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm font-medium rounded-xl transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Tambah Barang
              </button>
            ) : (
              <p className="text-xs text-slate-400">Maksimal {MAX_ITEMS} barang</p>
            )}

            <div className="flex-1" />

            <button
              onClick={handleOptimize}
              disabled={!canOptimize}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-bold rounded-xl shadow shadow-indigo-300/40 hover:shadow-md hover:shadow-indigo-400/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center gap-2"
            >
              {mutation.isPending ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Mengoptimalkan...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Optimalkan
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error state */}
        {mutation.isError && (
          <div className="mt-6 bg-rose-50 border border-rose-200 rounded-2xl p-4 text-sm text-rose-700 flex items-start gap-3">
            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-semibold">Gagal mengoptimalkan</p>
              <p className="text-rose-500 mt-0.5">{mutation.error.message}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">Hasil Optimasi</h3>
              <button
                onClick={handleDownloadImage}
                disabled={downloading}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium rounded-xl transition-colors disabled:opacity-50"
              >
                {downloading ? (
                  <span className="w-3.5 h-3.5 inline-block animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" />
                ) : (
                  <span>&#x2193;</span>
                )}
                {downloading ? 'Membuat gambar...' : 'Unduh Gambar'}
              </button>
            </div>
            <div ref={resultRef} className="p-4 rounded-2xl">
              <StoreResultCard result={result} />
            </div>
          </div>
        )}

        {/* Empty state */}
        {!result && !mutation.isPending && (
          <div className="mt-12 text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-slate-600 font-semibold">Belum ada hasil optimasi</p>
            <p className="text-slate-400 text-sm mt-1">
              Pilih barang dari katalog, lalu klik Optimalkan
            </p>
          </div>
        )}
      </main>

      {/* Product picker modal */}
      {showPicker && (
        <ProductPickerModal
          onClose={() => setShowPicker(false)}
          onSelect={handleSelect}
          excludeIds={excludeIds}
        />
      )}
    </div>
  )
}

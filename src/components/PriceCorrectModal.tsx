import { useEffect, useRef, useState } from 'react'
import { usePriceCorrection } from '@/hooks/usePriceCorrection'
import { ModalShell } from '@/components/ui/ModalShell'

interface Props {
  productId: number
  productName: string
  storeId: number
  currentPrice?: number
  unit?: string
  onClose: () => void
}

function fmt(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)
}

export function PriceCorrectModal({ productId, productName, storeId, currentPrice, unit, onClose }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const today = new Date().toISOString().slice(0, 10)

  const [price, setPrice] = useState(currentPrice ?? 0)
  const [date, setDate] = useState(today)
  const [isPromo, setIsPromo] = useState(false)
  const [done, setDone] = useState(false)

  const mutation = usePriceCorrection(productId)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const isValid = price > 0 && !!date

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid) return
    await mutation.mutateAsync({ storeId, price, dateRecorded: date, isPromo })
    setDone(true)
    setTimeout(onClose, 800)
  }

  return (
    <ModalShell open={true} onClose={onClose} variant="center">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-600 via-retro-warning to-retro-gold px-6 pt-5 pb-8">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-retro-text/60 text-xs font-medium uppercase tracking-wide mb-1">Koreksi Harga</p>
            <p className="text-retro-text font-bold text-base leading-snug line-clamp-2">{productName}</p>
            {currentPrice && currentPrice > 0 && (
              <p className="text-retro-gold/80 text-xs mt-1">Harga saat ini: {fmt(currentPrice)}/{unit ?? 'pcs'}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-none text-retro-text/60 hover:text-retro-text hover:bg-white/20 transition flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-6 -mt-4 pb-6 space-y-4 bg-white/90 backdrop-blur-2xl">
        {done && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 flex items-center gap-3">
            <span className="text-lg">✅</span>
            <p className="text-sm font-semibold text-emerald-800">Harga berhasil diperbarui</p>
          </div>
        )}

        {mutation.isError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 flex items-center gap-3">
            <span className="text-lg">❌</span>
            <p className="text-sm font-semibold text-red-700">Gagal menyimpan. Coba lagi.</p>
          </div>
        )}

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm px-4 py-4 space-y-4 mt-0">
          <div>
            <label className="text-xs font-semibold text-retro-muted uppercase tracking-wide">
              Harga Baru ({unit ?? 'pcs'}) <span className="text-red-400">*</span>
            </label>
            <div className="relative mt-1.5">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-retro-muted font-medium">Rp</span>
              <input
                ref={inputRef}
                type="number"
                min={1}
                step={100}
                value={price || ''}
                onChange={(e) => setPrice(Math.max(0, Number(e.target.value)))}
                placeholder="0"
                className={`w-full rounded-none border pl-9 pr-4 py-2.5 text-sm text-retro-text focus:outline-none focus:ring-2 focus:border-transparent transition ${
                  price <= 0 ? 'border-red-300 focus:ring-red-400' : 'border-gray-200 focus:ring-retro-gold'
                }`}
              />
            </div>
            {price > 0 && (
              <p className="text-xs text-retro-gold mt-1 font-medium">{fmt(price)}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-retro-muted uppercase tracking-wide">
              Tanggal Tercatat <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              value={date}
              max={today}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1.5 w-full rounded-none border border-gray-200 px-4 py-2.5 text-sm text-retro-text focus:outline-none focus:ring-2 focus:ring-retro-gold focus:border-transparent transition"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <div
              role="checkbox"
              aria-checked={isPromo}
              onClick={() => setIsPromo((v) => !v)}
              className={`w-10 h-6 rounded-full relative transition-colors ${isPromo ? 'bg-amber-50/300' : 'bg-gray-200'}`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${isPromo ? 'left-5' : 'left-1'}`} />
            </div>
            <span className="text-sm font-medium text-retro-body">Harga promo</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={!isValid || mutation.isPending || done}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-none font-bold text-sm text-retro-text bg-retro-warning hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          {mutation.isPending ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Menyimpan…
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Simpan Koreksi
            </>
          )}
        </button>
      </form>
    </ModalShell>
  )
}

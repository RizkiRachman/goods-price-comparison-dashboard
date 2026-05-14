import type { PriceRecord } from '@/types/api'
import { formatPrice } from '@/lib/utils'
import { GlassCard } from '@/components/ui/GlassCard'

function relativeDate(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000)
  if (diff === 0) return 'hari ini'
  if (diff === 1) return 'kemarin'
  if (diff < 7) return `${diff} hari lalu`
  if (diff < 30) return `${Math.floor(diff / 7)} minggu lalu`
  if (diff < 365) return `${Math.floor(diff / 30)} bulan lalu`
  return `${Math.floor(diff / 365)} tahun lalu`
}

const STORE_GRADIENTS = [
  'from-indigo-500 to-violet-600',
  'from-emerald-500 to-teal-600',
  'from-rose-500 to-pink-600',
  'from-amber-500 to-orange-600',
  'from-sky-500 to-blue-600',
  'from-purple-500 to-fuchsia-600',
]

function storeGradient(name: string): string {
  const code = name.charCodeAt(0) % STORE_GRADIENTS.length
  return STORE_GRADIENTS[code]
}

interface PriceBarProps {
  price: number
  min: number
  max: number
}

export function PriceBar({ price, min, max }: PriceBarProps) {
  const pct = max === min ? 100 : ((price - min) / (max - min)) * 100
  const color = pct <= 33 ? 'bg-emerald-500' : pct <= 66 ? 'bg-amber-400' : 'bg-red-400'
  return (
    <div className="w-full bg-slate-100/60 rounded-full h-1.5 mt-2">
      <div
        className={`h-1.5 rounded-full ${color}`}
        style={{ width: `${Math.max(8, pct)}%` }}
      />
    </div>
  )
}

interface ReceiptRowProps {
  item: PriceRecord
  min: number
  max: number
  isLowest?: boolean
  showUnitPrice?: boolean
  onEdit?: (item: PriceRecord) => void
  onDelete?: (item: PriceRecord) => void
}

export function ReceiptRow({ item, min, max, isLowest, showUnitPrice, onEdit, onDelete }: ReceiptRowProps) {
  const displayPrice = showUnitPrice ? (item.unitPrice ?? item.price) : item.price
  const pct = max === min ? 0 : ((displayPrice - min) / (max - min)) * 100

  const barColorClass =
    pct <= 33
      ? 'from-emerald-500 to-emerald-400'
      : pct <= 66
        ? 'from-amber-500 to-amber-400'
        : 'from-rose-500 to-rose-400'

  const progressBg =
    pct <= 33 ? 'bg-emerald-500' : pct <= 66 ? 'bg-amber-400' : 'bg-rose-500'

  const gradient = storeGradient(item.storeName ?? '?')
  const storeInitial = item.storeName?.charAt(0).toUpperCase() ?? '?'

  return (
    <GlassCard
      variant="interactive"
      className="overflow-hidden relative hover:-translate-y-0.5 transition-transform duration-150"
    >
      {/* Left accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${barColorClass}`} />

      <div className="p-4 sm:p-5 pl-5 sm:pl-6">
        <div className="flex items-start justify-between gap-3">
          {/* Left: avatar + info */}
          <div className="flex items-start gap-3 min-w-0">
            <div className={`w-10 h-10 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center text-white text-sm font-black shrink-0 shadow-sm`}>
              {storeInitial}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-slate-900 text-sm sm:text-base leading-tight">{item.storeName}</p>
                {isLowest && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-semibold rounded-full">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Termurah
                  </span>
                )}
                {item.isPromo && (
                  <span className="inline-flex items-center px-2 py-0.5 bg-rose-100 text-rose-600 text-[10px] font-semibold rounded-full">
                    Promo
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">{relativeDate(item.dateRecorded)}</p>
            </div>
          </div>

          {/* Right: price + actions */}
          <div className="text-right shrink-0">
            <p className="text-xl font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
              {formatPrice(displayPrice)}
            </p>
            {!showUnitPrice && item.unitPrice != null && item.unitPrice !== item.price && (
              <p className="text-[11px] text-slate-400 mt-0.5">{formatPrice(item.unitPrice)}/unit</p>
            )}
            {(onEdit || onDelete) && (
              <div className="flex items-center justify-end gap-1 mt-1.5">
                {onEdit && (
                  <button
                    onClick={() => onEdit(item)}
                    className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 active:bg-indigo-100 transition-colors"
                    aria-label="Edit"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(item)}
                    className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 active:bg-rose-100 transition-colors"
                    aria-label="Hapus"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 w-full bg-slate-100/60 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full rounded-full ${progressBg}`}
            style={{ width: `${Math.max(6, pct)}%` }}
          />
        </div>
      </div>
    </GlassCard>
  )
}

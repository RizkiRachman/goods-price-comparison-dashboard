import type { PriceRecord } from '@/types/api'
import { formatPrice } from '@/lib/utils'

interface PriceBarProps {
  price: number
  min: number
  max: number
}

export function PriceBar({ price, min, max }: PriceBarProps) {
  const pct = max === min ? 100 : ((price - min) / (max - min)) * 100
  const color = pct <= 33 ? 'bg-emerald-500' : pct <= 66 ? 'bg-amber-400' : 'bg-red-400'
  return (
    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
      <div
        className={`h-1.5 rounded-full ${color} transition-all duration-500`}
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
}

export function ReceiptRow({ item, min, max, isLowest, showUnitPrice }: ReceiptRowProps) {
  const displayPrice = showUnitPrice ? (item.unitPrice ?? item.price) : item.price
  const pct = max === min ? 0 : ((displayPrice - min) / (max - min)) * 100
  const barColor = pct <= 33
    ? 'from-emerald-500 to-emerald-400'
    : pct <= 66
      ? 'from-amber-500 to-amber-400'
      : 'from-red-500 to-red-400'

  const storeInitial = item.storeName?.charAt(0) ?? '?'

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-200">
      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${barColor} opacity-70`} />
      <div className="p-4 sm:p-5 pl-5 sm:pl-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
              {storeInitial}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-gray-900 text-sm sm:text-base">{item.storeName}</p>
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
              <PriceBar price={displayPrice} min={min} max={max} />
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-lg sm:text-xl font-extrabold text-gray-900 group-hover:text-indigo-600 transition-colors">
              {formatPrice(displayPrice)}
            </p>
            {!showUnitPrice && item.unitPrice != null && item.unitPrice !== item.price && (
              <p className="text-[11px] text-gray-400 mt-0.5">{formatPrice(item.unitPrice)}/unit</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

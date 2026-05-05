import { Link } from 'react-router-dom'
import type { GoodPriceSummary } from '@/types/goods'
import { formatPrice } from '@/lib/utils'

const CATEGORY_COLORS: Record<string, { bg: string; emoji: string }> = {
  Sayuran:         { bg: 'bg-gradient-to-br from-emerald-400 to-green-500', emoji: '🥬' },
  'Daging & Ikan': { bg: 'bg-gradient-to-br from-rose-400 to-red-500',     emoji: '🥩' },
  'Frozen Food':   { bg: 'bg-gradient-to-br from-cyan-400 to-blue-500',    emoji: '🧊' },
  Minuman:         { bg: 'bg-gradient-to-br from-sky-400 to-indigo-500',   emoji: '🥤' },
  'Dapur & Bumbu': { bg: 'bg-gradient-to-br from-amber-400 to-orange-500', emoji: '🧂' },
  'Rumah Tangga':  { bg: 'bg-gradient-to-br from-violet-400 to-purple-500', emoji: '🏠' },
  Makanan:         { bg: 'bg-gradient-to-br from-orange-400 to-amber-500', emoji: '🍽️' },
  Snack:           { bg: 'bg-gradient-to-br from-pink-400 to-rose-500',    emoji: '🍿' },
  Buah:            { bg: 'bg-gradient-to-br from-lime-400 to-green-500',   emoji: '🍎' },
}
const DEFAULT_COLOR = { bg: 'bg-gradient-to-br from-violet-400 to-fuchsia-500', emoji: '📦' }

interface Props {
  good: GoodPriceSummary
}

export function GoodCard({ good }: Props) {
  const color = CATEGORY_COLORS[good.category] ?? DEFAULT_COLOR

  return (
    <Link to={`/goods/${good.goodId}`} className="group block">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:shadow-indigo-100 hover:-translate-y-1 transition-all duration-200 overflow-hidden">
        <div className={`h-1.5 ${color.bg}`} />

        <div className="p-3">
          <div className="flex items-start gap-2.5">
            <div className={`w-9 h-9 ${color.bg} rounded-lg flex items-center justify-center text-lg shadow-sm flex-shrink-0`}>
              {color.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 text-sm leading-tight line-clamp-2 group-hover:text-indigo-600 transition-colors">
                {good.goodName}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">{good.category}</p>
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-lg font-bold text-gray-900">
              {good.avgPrice > 0 ? formatPrice(good.avgPrice) : '-'}
            </span>
            <span className="text-xs text-gray-400">/{good.unit}</span>
          </div>

          <div className="mt-2 flex items-center gap-3 text-[10px]">
            <span className="text-emerald-600 font-medium">
              ↓ {good.lowestPrice > 0 ? formatPrice(good.lowestPrice) : '-'}
            </span>
            <span className="text-gray-300">|</span>
            <span className="text-rose-500 font-medium">
              ↑ {good.highestPrice > 0 ? formatPrice(good.highestPrice) : '-'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

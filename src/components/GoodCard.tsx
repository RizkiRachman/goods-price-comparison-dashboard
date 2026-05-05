import { Link } from 'react-router-dom'
import type { GoodPriceSummary } from '@/types/goods'
import { formatPrice } from '@/lib/utils'

const CATEGORY_COLORS: Record<string, { accent: string; tint: string; emoji: string }> = {
  Sayuran:         { accent: 'bg-gradient-to-r from-emerald-400 to-green-500',  tint: 'bg-emerald-50',  emoji: '🥬' },
  'Daging & Ikan': { accent: 'bg-gradient-to-r from-rose-400 to-red-500',       tint: 'bg-rose-50',     emoji: '🥩' },
  'Frozen Food':   { accent: 'bg-gradient-to-r from-cyan-400 to-blue-500',      tint: 'bg-cyan-50',     emoji: '🧊' },
  Minuman:         { accent: 'bg-gradient-to-r from-sky-400 to-indigo-500',     tint: 'bg-sky-50',      emoji: '🥤' },
  'Dapur & Bumbu': { accent: 'bg-gradient-to-r from-amber-400 to-orange-500',   tint: 'bg-amber-50',    emoji: '🧂' },
  'Rumah Tangga':  { accent: 'bg-gradient-to-r from-violet-400 to-purple-500',  tint: 'bg-violet-50',   emoji: '🏠' },
  Makanan:         { accent: 'bg-gradient-to-r from-orange-400 to-amber-500',   tint: 'bg-orange-50',   emoji: '🍽️' },
  Snack:           { accent: 'bg-gradient-to-r from-pink-400 to-rose-500',      tint: 'bg-pink-50',     emoji: '🍿' },
  Buah:            { accent: 'bg-gradient-to-r from-lime-400 to-green-500',     tint: 'bg-lime-50',     emoji: '🍎' },
}
const DEFAULT_COLOR = { accent: 'bg-gradient-to-r from-violet-400 to-fuchsia-500', tint: 'bg-violet-50', emoji: '📦' }

interface Props {
  good: GoodPriceSummary
}

export function GoodCard({ good }: Props) {
  const color = CATEGORY_COLORS[good.category] ?? DEFAULT_COLOR

  const rangeWidth =
    good.highestPrice > good.lowestPrice && good.lowestPrice > 0
      ? Math.round(((good.avgPrice - good.lowestPrice) / (good.highestPrice - good.lowestPrice)) * 100)
      : 50

  const hasPriceRange = good.lowestPrice > 0 && good.highestPrice > 0

  return (
    <Link to={`/goods/${good.goodId}`} className="group block">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-100/40 hover:-translate-y-1.5 transition-all duration-200 overflow-hidden flex flex-col">
        {/* Top accent bar */}
        <div className={`h-1 ${color.accent}`} />

        <div className="p-4 flex flex-col flex-1 gap-3">
          {/* Icon + name + category */}
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 ${color.tint} rounded-2xl flex items-center justify-center text-xl flex-shrink-0`}>
              {color.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-800 text-sm leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors">
                {good.goodName}
              </p>
              <span className="inline-block mt-1 text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                {good.category}
              </span>
            </div>
          </div>

          {/* Avg price */}
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-slate-900 tracking-tight">
                {good.avgPrice > 0 ? formatPrice(good.avgPrice) : '-'}
              </span>
              <span className="text-xs text-slate-400 font-medium">/{good.unit}</span>
            </div>

            {/* Mini range bar — visible by default */}
            {hasPriceRange && (
              <div className="mt-2">
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-rose-400 rounded-full"
                    style={{ width: `${Math.max(8, rangeWidth)}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="text-[10px] font-semibold text-emerald-500">
                    {formatPrice(good.lowestPrice)}
                  </span>
                  <span className="text-[10px] font-semibold text-rose-400">
                    {formatPrice(good.highestPrice)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Expandable price breakdown — appears on hover */}
          <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] [transition:grid-template-rows_0.35s_ease]">
            <div className="overflow-hidden">
              <div className="pt-2 border-t border-slate-100 mt-1 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">Rata-rata</span>
                  <span className="text-xs font-bold text-indigo-600">
                    {good.avgPrice > 0 ? formatPrice(good.avgPrice) : '-'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">Terendah</span>
                  <span className="text-xs font-bold text-emerald-500">
                    {good.lowestPrice > 0 ? formatPrice(good.lowestPrice) : '-'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">Tertinggi</span>
                  <span className="text-xs font-bold text-rose-400">
                    {good.highestPrice > 0 ? formatPrice(good.highestPrice) : '-'}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Link>
  )
}

import { Link } from 'react-router-dom'
import type { Store } from '@/types/api'

const CHAIN_COLORS: Record<string, { bg: string; emoji: string }> = {
  Indomaret:  { bg: 'bg-gradient-to-br from-blue-400 to-blue-600',    emoji: '🏪' },
  Alfamart:   { bg: 'bg-gradient-to-br from-red-400 to-red-600',     emoji: '🏪' },
  Alfamidi:   { bg: 'bg-gradient-to-br from-orange-400 to-red-500',  emoji: '🏪' },
  Superindo:  { bg: 'bg-gradient-to-br from-emerald-400 to-green-600', emoji: '🛒' },
  Hypermart:  { bg: 'bg-gradient-to-br from-purple-400 to-violet-600', emoji: '🛍️' },
  Lottemart:  { bg: 'bg-gradient-to-br from-pink-400 to-rose-500',   emoji: '🏢' },
  Transmart:  { bg: 'bg-gradient-to-br from-cyan-400 to-teal-500',   emoji: '🏬' },
  'Diamond Supermarket': { bg: 'bg-gradient-to-br from-amber-400 to-yellow-500', emoji: '💎' },
}
const DEFAULT_COLOR = { bg: 'bg-gradient-to-br from-slate-400 to-slate-600', emoji: '🏪' }

interface StoreWithStats extends Store {
  totalProducts?: number
}

interface Props {
  store: StoreWithStats
}

export function StoreCard({ store }: Props) {
  const color = CHAIN_COLORS[store.chain ?? ''] ?? DEFAULT_COLOR

  return (
    <Link to={`/stores/${store.id}`} className="block">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:shadow-indigo-100 hover:-translate-y-0.5 transition-all duration-200 overflow-hidden">
        <div className={`h-1.5 ${color.bg}`} />

        <div className="p-3">
          <div className="flex items-start gap-2.5">
            <div className={`w-9 h-9 ${color.bg} rounded-lg flex items-center justify-center text-lg shadow-sm flex-shrink-0`}>
              {color.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 text-sm leading-tight line-clamp-2">
                {store.name}
              </p>
              {store.chain && (
                <p className="text-[10px] text-gray-400 mt-0.5">{store.chain}</p>
              )}
            </div>
          </div>

          {store.totalProducts !== undefined && (
            <div className="mt-2.5 flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${store.totalProducts > 100 ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <span className="text-xs font-medium text-gray-600">
                {store.totalProducts} produk
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

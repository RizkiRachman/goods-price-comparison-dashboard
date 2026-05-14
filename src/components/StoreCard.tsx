import { Link } from 'react-router-dom'
import type { Store } from '@/types/api'
import { GlassCard } from '@/components/ui/GlassCard'

const CHAIN_COLORS: Record<string, { gradient: string; initials: string }> = {
  Indomaret:  { gradient: 'from-blue-500 to-blue-700',       initials: 'IN' },
  Alfamart:   { gradient: 'from-red-500 to-red-700',         initials: 'AL' },
  Alfamidi:   { gradient: 'from-orange-400 to-red-500',      initials: 'AM' },
  Superindo:  { gradient: 'from-emerald-500 to-green-700',   initials: 'SI' },
  Hypermart:  { gradient: 'from-purple-500 to-violet-700',   initials: 'HM' },
  Lottemart:  { gradient: 'from-pink-500 to-rose-600',       initials: 'LM' },
  Transmart:  { gradient: 'from-cyan-500 to-teal-600',       initials: 'TM' },
  'Diamond Supermarket': { gradient: 'from-amber-400 to-yellow-600', initials: 'DS' },
}
const DEFAULT_GRADIENT = 'from-slate-500 to-slate-700'

interface StoreWithStats extends Store {
  totalProducts?: number
}

interface Props {
  store: StoreWithStats
}

export function StoreCard({ store }: Props) {
  const chain = CHAIN_COLORS[store.chain ?? '']
  const gradient = chain?.gradient ?? DEFAULT_GRADIENT
  const initial = store.name.charAt(0).toUpperCase()

  return (
    <Link to={`/stores/${store.id}`} className="group block">
      <GlassCard
        variant="interactive"
        className="overflow-hidden hover:-translate-y-1.5 transition-transform duration-200 active:scale-[0.98]"
      >
        {/* Top accent */}
        <div className={`h-1 bg-gradient-to-r ${gradient}`} />

        <div className="p-4 flex flex-col gap-3">
          {/* Avatar + name */}
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center text-white text-sm font-black flex-shrink-0 shadow-sm`}>
              {initial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-800 text-sm leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors">
                {store.name}
              </p>
              {store.chain && (
                <span className="inline-block mt-1 text-[10px] font-semibold text-slate-400 bg-white/70 backdrop-blur px-2 py-0.5 rounded-full border border-slate-200/50">
                  {store.chain}
                </span>
              )}
            </div>
          </div>

          {/* Location */}
          {store.location && (
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <svg className="w-3 h-3 flex-shrink-0 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="line-clamp-1">{store.location}</span>
            </div>
          )}

          {/* Product count */}
          {store.totalProducts !== undefined && (
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${store.totalProducts > 100 ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                <span className="text-xs font-semibold text-slate-600">
                  {store.totalProducts} produk
                </span>
              </div>
              <svg className="w-4 h-4 text-slate-200 group-hover:text-indigo-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          )}
        </div>
      </GlassCard>
    </Link>
  )
}

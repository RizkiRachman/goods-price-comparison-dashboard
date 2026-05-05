const CATEGORY_META: Record<string, { emoji: string; color: string; active: string }> = {
  All:             { emoji: '🛒', color: 'bg-gray-100 text-gray-600 border-gray-200 hover:border-gray-400',             active: 'bg-gray-800 text-white border-gray-800 shadow-lg' },
  Sayuran:         { emoji: '🥬', color: 'bg-green-50 text-green-700 border-green-200 hover:border-green-400',          active: 'bg-green-600 text-white border-green-600 shadow-green-200 shadow-lg' },
  'Daging & Ikan': { emoji: '🥩', color: 'bg-red-50 text-red-700 border-red-200 hover:border-red-400',                 active: 'bg-red-500 text-white border-red-500 shadow-red-200 shadow-lg' },
  'Frozen Food':   { emoji: '🧊', color: 'bg-cyan-50 text-cyan-700 border-cyan-200 hover:border-cyan-400',             active: 'bg-cyan-500 text-white border-cyan-500 shadow-cyan-200 shadow-lg' },
  Minuman:         { emoji: '🥛', color: 'bg-sky-50 text-sky-700 border-sky-200 hover:border-sky-400',                 active: 'bg-sky-500 text-white border-sky-500 shadow-sky-200 shadow-lg' },
  'Dapur & Bumbu': { emoji: '🧂', color: 'bg-amber-50 text-amber-700 border-amber-200 hover:border-amber-400',         active: 'bg-amber-500 text-white border-amber-500 shadow-amber-200 shadow-lg' },
  'Rumah Tangga':  { emoji: '🏠', color: 'bg-purple-50 text-purple-700 border-purple-200 hover:border-purple-400',     active: 'bg-purple-500 text-white border-purple-500 shadow-purple-200 shadow-lg' },
}
const DEFAULT_META = { emoji: '📦', color: 'bg-gray-100 text-gray-600 border-gray-200', active: 'bg-gray-800 text-white border-gray-800 shadow-lg' }

interface Props {
  categories: string[]
  selected: string
  onSelect: (c: string) => void
}

export function CategoryChips({ categories, selected, onSelect }: Props) {
  const all = ['All', ...categories]
  return (
    <div className="flex gap-2 flex-wrap">
      {all.map((cat) => {
        const meta = CATEGORY_META[cat] ?? DEFAULT_META
        const isActive = selected === cat
        return (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 ${isActive ? meta.active + ' scale-105' : meta.color}`}
          >
            {meta.emoji} {cat}
          </button>
        )
      })}
    </div>
  )
}

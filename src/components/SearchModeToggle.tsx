interface Props {
  mode: 'product' | 'store'
  onModeChange: (mode: 'product' | 'store') => void
}

export function SearchModeToggle({ mode, onModeChange }: Props) {
  return (
    <div className="inline-flex items-center gap-1 bg-white/10 backdrop-blur-md rounded-lg p-1 border border-white/10">
      <button
        onClick={() => onModeChange('product')}
        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-md text-sm font-medium transition-all ${
          mode === 'product'
            ? 'bg-white/90 text-indigo-600 shadow-sm'
            : 'text-white/70 hover:text-white hover:bg-white/10'
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        Produk
      </button>

      <button
        onClick={() => onModeChange('store')}
        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-md text-sm font-medium transition-all ${
          mode === 'store'
            ? 'bg-white/90 text-indigo-600 shadow-sm'
            : 'text-white/70 hover:text-white hover:bg-white/10'
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        Toko
      </button>
    </div>
  )
}

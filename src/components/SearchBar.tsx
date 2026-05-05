interface Props {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}

export function SearchBar({ value, onChange, placeholder = 'Cari barang kebutuhan sehari-hari...' }: Props) {
  return (
    <div className="relative w-full">
      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
      </span>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-14 pr-14 py-4 sm:py-5 rounded-2xl bg-white/15 backdrop-blur-xl border border-white/20 text-white placeholder-white/40 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/20 transition-all duration-200 shadow-xl"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-5 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white/70 hover:text-white transition"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}

interface Props {
  chains: string[]
  selected: string
  onSelect: (chain: string) => void
}

const CHAIN_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  All: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' },
  Indomaret: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  Alfamart: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  Alfamidi: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  Superindo: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  Hypermart: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
}

const DEFAULT_COLOR = { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' }

export function ChainFilterChips({ chains, selected, onSelect }: Props) {
  const allChains = ['All', ...chains]

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {allChains.map((chain) => {
        const colors = CHAIN_COLORS[chain] ?? DEFAULT_COLOR
        const isSelected = selected === chain

        return (
          <button
            key={chain}
            onClick={() => onSelect(chain)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 whitespace-nowrap ${
              isSelected
                ? `${colors.bg} ${colors.text} ${colors.border} shadow-md`
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            {chain === 'All' ? 'Semua Toko' : chain}
          </button>
        )
      })}
    </div>
  )
}

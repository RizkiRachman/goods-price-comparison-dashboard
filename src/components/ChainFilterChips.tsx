interface Props {
  chains: string[]
  selected: string
  onSelect: (chain: string) => void
}

const CHAIN_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  All: { bg: 'bg-retro-surface-alt', text: 'text-retro-text', border: 'border-retro-border' },
  Indomaret: { bg: 'bg-retro-surface', text: 'text-retro-brand', border: 'border-retro-brand/40' },
  Alfamart: { bg: 'bg-retro-surface', text: 'text-retro-danger', border: 'border-retro-danger/40' },
  Alfamidi: { bg: 'bg-retro-surface', text: 'text-retro-warning', border: 'border-retro-warning/40' },
  Superindo: { bg: 'bg-retro-surface', text: 'text-retro-success', border: 'border-retro-success/40' },
  Hypermart: { bg: 'bg-retro-surface', text: 'text-retro-gold', border: 'border-retro-gold/50' },
}

const DEFAULT_COLOR = { bg: 'bg-retro-surface-alt', text: 'text-retro-text', border: 'border-retro-border' }

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
            className={`flex-shrink-0 px-4 py-2 rounded-none text-sm font-medium border backdrop-blur-sm whitespace-nowrap transition-all active:scale-95 ${
              isSelected
                ? `${colors.bg} ${colors.text} ${colors.border} shadow-md shadow-black/5`
                : 'bg-retro-surface/60 text-retro-muted border-retro-border/40 hover:border-retro-border hover:bg-retro-surface-alt'
            }`}
          >
            {chain === 'All' ? 'Semua Toko' : chain}
          </button>
        )
      })}
    </div>
  )
}

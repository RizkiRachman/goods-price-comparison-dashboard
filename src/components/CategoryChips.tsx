const CATEGORY_META: Record<string, { emoji: string; color: string; active: string }> = {
  All: { emoji: '🛒', color: 'bg-retro-surface-alt text-retro-muted border-retro-border/40 hover:border-retro-border', active: 'bg-retro-surface border-retro-gold/70 text-retro-gold shadow-lg shadow-black/20' },
  Sayuran: { emoji: '🥬', color: 'bg-retro-surface-alt/80 text-retro-success border-retro-border/40 hover:border-retro-success/40', active: 'bg-retro-surface border-retro-success/60 text-retro-success' },
  'Daging & Ikan': { emoji: '🥩', color: 'bg-retro-surface-alt/80 text-retro-danger border-retro-border/40 hover:border-retro-danger/40', active: 'bg-retro-surface border-retro-danger/60 text-retro-danger' },
  'Frozen Food': { emoji: '🧊', color: 'bg-retro-surface-alt/80 text-retro-brand border-retro-border/40 hover:border-retro-brand/40', active: 'bg-retro-surface border-retro-brand/60 text-retro-brand' },
  Minuman: { emoji: '🥛', color: 'bg-retro-surface-alt/80 text-retro-brand border-retro-border/40 hover:border-retro-brand/40', active: 'bg-retro-surface border-retro-brand/60 text-retro-brand' },
  'Dapur & Bumbu': { emoji: '🧂', color: 'bg-retro-surface-alt/80 text-retro-warning border-retro-border/40 hover:border-retro-warning/40', active: 'bg-retro-surface border-retro-warning/60 text-retro-warning' },
  'Rumah Tangga': { emoji: '🏠', color: 'bg-retro-surface-alt/80 text-retro-gold border-retro-border/40 hover:border-retro-gold/50', active: 'bg-retro-surface border-retro-gold/60 text-retro-gold' },
}
const DEFAULT_META = { emoji: '📦', color: 'bg-retro-surface-alt text-retro-muted border-retro-border/40', active: 'bg-retro-surface border-retro-gold/70 text-retro-gold' }

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
            className={`px-4 py-2 rounded-none text-sm font-semibold border backdrop-blur-sm transition-all active:scale-95 ${isActive ? meta.active : meta.color}`}
          >
            {meta.emoji} {cat}
          </button>
        )
      })}
    </div>
  )
}

import { motion } from 'motion/react'

const shimmerTransition = { repeat: Infinity, duration: 1.5, ease: 'easeInOut' as const } as const

const shimmerVariants = {
  animate: {
    opacity: [0.4, 0.7, 0.4],
    transition: shimmerTransition,
  },
}

function ShimmerBlock({ className }: { className: string }) {
  return <motion.div variants={shimmerVariants} animate="animate" className={`bg-gradient-to-r from-retro-surface-alt via-retro-surface to-retro-surface-alt rounded-none ${className}`} />
}

export function SkeletonCard() {
  return (
    <div className="bg-retro-surface/80 border border-retro-border/30 rounded-none overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-retro-surface-alt via-retro-surface to-retro-surface-alt" />
      <div className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          <ShimmerBlock className="w-10 h-10 rounded-none flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <ShimmerBlock className="h-3.5 w-3/4" />
            <ShimmerBlock className="h-2.5 w-1/2" />
          </div>
        </div>
        <ShimmerBlock className="h-5 w-24" />
        <div className="flex items-center gap-3">
          <ShimmerBlock className="h-3 w-16" />
          <ShimmerBlock className="h-3 w-16" />
        </div>
      </div>
    </div>
  )
}

export function StoreSkeletonCard() {
  return (
    <div className="bg-retro-surface/80 border border-retro-border/30 rounded-none overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-retro-surface-alt via-retro-surface to-retro-surface-alt" />
      <div className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          <ShimmerBlock className="w-10 h-10 rounded-none flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <ShimmerBlock className="h-3.5 w-3/4" />
            <ShimmerBlock className="h-2.5 w-1/3" />
          </div>
        </div>
        <ShimmerBlock className="h-3 w-20" />
      </div>
    </div>
  )
}

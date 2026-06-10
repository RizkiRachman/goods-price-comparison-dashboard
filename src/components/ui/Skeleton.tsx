import { motion } from 'motion/react'

interface SkeletonProps {
  className?: string
  /** Shape variant */
  shape?: 'rect' | 'circle' | 'text'
  /** Width (tailwind class or arbitrary) */
  width?: string
  /** Height (tailwind class or arbitrary) */
  height?: string
}

const shimmerTransition = { repeat: Infinity, duration: 1.5, ease: 'easeInOut' as const } as const

const shimmerVariants = {
  animate: {
    opacity: [0.4, 0.7, 0.4],
    transition: shimmerTransition,
  },
}

export function Skeleton({ className = '', shape = 'rect', width, height }: SkeletonProps) {
  const shapeClass =
    shape === 'circle' ? 'rounded-none' : shape === 'text' ? 'rounded-none' : 'rounded-none'

  return (
    <motion.div
      variants={shimmerVariants}
      animate="animate"
      className={`bg-gradient-to-r from-retro-surface-alt via-retro-surface to-retro-surface-alt ${shapeClass} ${className}`}
      style={{
        width: width ?? (shape === 'circle' ? '40px' : '100%'),
        height: height ?? (shape === 'text' ? '14px' : '40px'),
      }}
    />
  )
}

/** Convenience: Card skeleton with accent bar and content placeholders */
export function CardSkeleton() {
  return (
    <div className="bg-retro-surface/90 backdrop-blur-xl border border-retro-border/30 rounded-none overflow-hidden shadow-lg shadow-black/5">
      <div className="h-1 bg-gradient-to-r from-retro-surface-alt via-retro-surface to-retro-surface-alt" />
      <div className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          <Skeleton shape="rect" className="w-10 h-10 rounded-none" />
          <div className="flex-1 space-y-2">
            <Skeleton shape="text" className="w-3/4" height="14px" />
            <Skeleton shape="text" className="w-1/3" height="10px" />
          </div>
        </div>
        <Skeleton shape="text" className="w-1/2" height="20px" />
        <Skeleton shape="text" className="w-full" height="6px" />
      </div>
    </div>
  )
}

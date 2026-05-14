import { type ReactNode, forwardRef } from 'react'

interface GlassCardProps {
  children?: ReactNode
  variant?: 'default' | 'interactive' | 'frosted'
  className?: string
  style?: React.CSSProperties
  onClick?: React.MouseEventHandler<HTMLDivElement>
}

const styles: Record<string, string> = {
  default: 'bg-white/80 backdrop-blur-xl border border-white/20 shadow-lg shadow-black/5',
  interactive:
    'bg-white/70 backdrop-blur-xl border border-white/20 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10 cursor-pointer transition-shadow duration-200',
  frosted: 'bg-white/30 backdrop-blur-2xl border border-white/10 shadow-md shadow-black/5',
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ variant = 'default', className = '', style, onClick, children }, ref) => {
    return (
      <div
        ref={ref}
        className={`rounded-2xl ${styles[variant]} ${className}`}
        style={{ willChange: 'transform', ...style }}
        onClick={onClick}
      >
        {children}
      </div>
    )
  },
)

GlassCard.displayName = 'GlassCard'

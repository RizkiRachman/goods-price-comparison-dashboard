import { type ReactNode, forwardRef } from 'react'

interface GlassCardProps {
  children?: ReactNode
  variant?: 'default' | 'interactive' | 'frosted'
  className?: string
  style?: React.CSSProperties
  onClick?: React.MouseEventHandler<HTMLDivElement>
}

const styles: Record<string, string> = {
  default: 'bg-retro-surface/80 border border-retro-border/30',
  interactive:
    'bg-retro-surface/70 border border-retro-border/30 cursor-pointer transition-shadow duration-200',
  frosted: 'bg-retro-surface/50 border border-retro-border/20',
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ variant = 'default', className = '', style, onClick, children }, ref) => {
    return (
      <div
        ref={ref}
        className={`rounded-none ${styles[variant]} ${className}`}
        style={{ willChange: 'transform', ...style }}
        onClick={onClick}
      >
        {children}
      </div>
    )
  },
)

GlassCard.displayName = 'GlassCard'

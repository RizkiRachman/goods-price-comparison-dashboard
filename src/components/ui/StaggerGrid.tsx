import { type ReactNode } from 'react'
import { motion } from 'motion/react'

interface StaggerGridProps {
  children: ReactNode
  className?: string
  staggerDelay?: number
  once?: boolean
}

const itemTransition = { duration: 0.25, ease: 'easeOut' as const }

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: itemTransition,
  },
}

export function StaggerGrid({
  children,
  className = '',
  staggerDelay = 0.04,
  once = true,
}: StaggerGridProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.05,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/** Wrap each item with this inside <StaggerGrid> to get staggered animation */
export function StaggerItem({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  )
}

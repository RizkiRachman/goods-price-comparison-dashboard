import { type ReactNode } from 'react'
import { motion } from 'motion/react'

interface PageTransitionProps {
  children: ReactNode
  className?: string
}

const pageVisibleTransition = { duration: 0.2, ease: 'easeOut' as const }

const pageVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: pageVisibleTransition,
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: { duration: 0.12 },
  },
}

export function PageTransition({ children, className = '' }: PageTransitionProps) {
  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={className}
    >
      {children}
    </motion.div>
  )
}

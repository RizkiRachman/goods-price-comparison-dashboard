import { useEffect, useRef, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'motion/react'

interface DrawerShellProps {
  open: boolean
  onClose: () => void
  children: ReactNode
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const drawerVisibleTransition = { type: 'spring' as const, damping: 35, stiffness: 400, mass: 0.5 }
const drawerExitTransition = { duration: 0.15, ease: 'easeIn' as const }

const drawerVariants = {
  hidden: { x: '100%' },
  visible: {
    x: 0,
    transition: drawerVisibleTransition,
  },
  exit: {
    x: '100%',
    transition: drawerExitTransition,
  },
}

export function DrawerShell({ open, onClose, children }: DrawerShellProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            ref={overlayRef}
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer panel */}
          <motion.div
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-sm bg-white/90 backdrop-blur-2xl border-l border-white/20 h-full flex flex-col shadow-2xl"
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

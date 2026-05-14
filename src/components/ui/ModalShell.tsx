import { useEffect, useRef, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'motion/react'

interface ModalShellProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  variant?: 'sheet' | 'center'
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const sheetTransition = { type: 'spring' as const, damping: 30, stiffness: 350, mass: 0.5 }
const sheetExitTransition = { duration: 0.15, ease: 'easeIn' as const }

const sheetVariants = {
  hidden: { y: '100%', opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: sheetTransition,
  },
  exit: {
    y: '100%',
    opacity: 0,
    transition: sheetExitTransition,
  },
}

const centerVariants = {
  hidden: { scale: 0.92, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.2, ease: 'easeOut' as const },
  },
  exit: {
    scale: 0.92,
    opacity: 0,
    transition: { duration: 0.12 },
  },
}

export function ModalShell({ open, onClose, children, variant = 'sheet' }: ModalShellProps) {
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
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
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

          {/* Sheet (mobile) / Center (desktop) */}
          <motion.div
            variants={variant === 'sheet' ? sheetVariants : centerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[85vh] sm:max-h-[600px] bg-white/90 backdrop-blur-2xl border border-white/20"
          >
            {/* Drag handle (mobile) */}
            <div className="flex justify-center pt-3 pb-1 sm:hidden">
              <div className="w-10 h-1 rounded-full bg-white/40" />
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
